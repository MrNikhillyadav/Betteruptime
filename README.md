# BetterUptime – Website Monitoring System

A BetterUptime-inspired website monitoring system built to explore **scalable system design**, **async processing**, and **real-world backend architecture**.

This project focuses on how to monitor a large number of websites efficiently, process checks asynchronously, and serve fast dashboards without overloading the database or backend.

---

## 📂 Project Structure

This is a **Turborepo monorepo** managed with **Bun** as the package manager.

```
betteruptime/
├── apps/
│   ├── api/              # Express.js REST API
│   ├── frontend/         # Next.js dashboard
│   ├── pusher/           # Redis Stream producer (polls DB)
│   └── consumer/         # Redis Stream consumer (performs checks)
├── packages/
│   ├── store/            # Prisma client + database schema
│   ├── redis-stream/     # Redis Stream utilities (xAdd, xReadGroup, xAck)
│   ├── typescript-config/# Shared TypeScript config
│   ├── eslint-config/    # Shared ESLint config
│   └── ui/               # Shared React UI components
├── docker/               # Docker configurations
├── docker-compose.yml    # Local development setup
└── docker-compose.prod.yml # Production setup
```

---

## 🏗️ System Architecture

### High-Level Overview

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   Frontend  │─────▶│     API     │─────▶│  PostgreSQL  │
│  (Next.js)  │      │  (Express)  │      │              │
└─────────────┘      └─────────────┘      └──────────────┘
                                                  ▲
                                                  │
                                                  │
                     ┌─────────────────────────────┼─────────┐
                     │                             │         │
              ┌──────▼──────┐             ┌────────▼──────┐ │
              │   Pusher    │             │   Consumer    │ │
              │ (Publisher) │             │   (Workers)   │ │
              └──────┬──────┘             └────────▲──────┘ │
                     │                             │         │
                     │        ┌────────────────────┘         │
                     │        │                              │
                     ▼        ▼                              │
              ┌───────────────────────┐                      │
              │    Redis Streams      │                      │
              │  (Message Queue)      │                      │
              └───────────────────────┘                      │
                                                             │
                     Writes ticks ────────────────────────────┘
```

---

## 👤 User Flow

1. **Signup/Login**
   - User creates an account or logs in via `/signup` or `/signin` API endpoints
   - Backend issues a JWT token (currently stored in localStorage)

2. **Dashboard Access**
   - User accesses the Next.js frontend
   - Dashboard fetches user's websites from `/website` endpoint

3. **Add Website**
   - User submits a URL to monitor
   - API stores website metadata in PostgreSQL
   - Website is now queued for monitoring

4. **View Monitoring Data**
   - Dashboard displays:
     - Website status (UP/DOWN)
     - Latest response time
     - Historical response times (last 10 ticks)
   - Data is pre-aggregated by backend workers

---

## ⏱️ Data Flow & Monitoring Process

### 1. **Pusher (Producer)**

```typescript
// apps/pusher/src/index.ts
// Runs every 3 minutes
┌─────────────────────────────────────────────────┐
│ 1. Fetch all websites from PostgreSQL          │
│ 2. Push {url, id} to Redis Stream using xAdd   │
│ 3. Redis distributes work to consumer groups   │
└─────────────────────────────────────────────────┘
```

**Key Features:**
- Bulk operations for efficiency
- Periodic polling (3-minute intervals)
- Lightweight producer pattern

### 2. **Redis Streams (Message Queue)**

```typescript
// packages/redis-stream/index.ts
Stream Name: "betteruptime:website"
Consumer Groups: Region-based (e.g., "INDIA", "USA")
```

**Operations:**
- `xAdd()` - Add website check task to stream
- `xReadGroup()` - Consumer reads pending messages
- `xAck()` - Acknowledge processed messages

### 3. **Consumer (Worker)**

```typescript
// apps/consumer/src/index.ts
┌─────────────────────────────────────────────────┐
│ 1. Worker reads batch from Redis Stream        │
│ 2. For each website:                            │
│    ├─ HTTP GET request to URL                   │
│    ├─ Measure response time                     │
│    ├─ Determine status (Up/Down)                │
│    └─ Write to PostgreSQL (WebsiteTick table)   │
│ 3. Acknowledge messages in bulk                 │
│ 4. Repeat (with backoff on errors)              │
└─────────────────────────────────────────────────┘
```

**Key Features:**
- Parallel processing with `Promise.all()`
- Automatic backoff (1s when empty, 5s on error)
- Region-based workers for geographical distribution
- Batch acknowledgment after successful processing

### 4. **API (Backend)**

```typescript
// apps/api/src/index.ts
Endpoints:
- POST /signup       # Create user account
- POST /signin       # Authenticate user
- POST /website      # Add website to monitor
- GET  /website      # Fetch user's websites with ticks
```

**Key Features:**
- JWT-based authentication
- Protected routes with `authMiddleware`
- Aggregated queries (includes last 10 ticks)

### 5. **Frontend (Dashboard)**

```typescript
// apps/frontend/
- Fetches website data from API
- Displays status badges (UP/DOWN)
- Shows response time history
- Real-time updates via periodic polling
```

---

## 🗄️ Database Schema

```prisma
// packages/store/prisma/schema.prisma

model User {
  id       String    @id @default(uuid())
  username String    @unique
  password String    # bcrypt hashed
  websites Website[]
}

model Website {
  id        String         @id @default(uuid())
  url       String
  userId    String
  user      User           @relation(...)
  ticks     WebsiteTick[]
  timeAdded DateTime       @default(now())
}

model Region {
  id    String        @id @default(uuid())
  name  String        # e.g., "INDIA", "USA"
  ticks WebsiteTick[]
}

model WebsiteTick {
  id             String         @id @default(uuid())
  responseTimeMs Int            # Measured response time
  status         WebsiteStatus  # Up/Down/Unknown
  regionId       String
  websiteId      String
  region         Region         @relation(...)
  website        Website        @relation(...)
  createdAt      DateTime       @default(now())
}

enum WebsiteStatus {
  Up
  Down
  Unknown
}
```

---

## 👥 Region-Based Consumers

The system supports **multiple geographic regions** for monitoring:

- Separate **Redis consumer groups** per region (e.g., `INDIA`, `USA`)
- Each group can have **multiple workers** for horizontal scaling
- Load distribution is handled automatically by **Redis Streams**
- Environment variables:
  - `CONSUMER_GROUP_REGION_ID` - Region name
  - `WORKER_ID` - Unique worker identifier

**Example:**
```bash
# India Region - Worker 1
CONSUMER_GROUP_REGION_ID=INDIA WORKER_ID=worker-1

# India Region - Worker 2
CONSUMER_GROUP_REGION_ID=INDIA WORKER_ID=worker-2

# USA Region - Worker 1
CONSUMER_GROUP_REGION_ID=USA WORKER_ID=worker-1
```

---

## 🧪 Why Redis Streams?

Redis Streams were chosen over traditional pub/sub or simple queues because they provide:

✅ **Message persistence** - Messages aren't lost if consumer is offline  
✅ **Consumer groups** - Automatic load distribution  
✅ **Message replay** - Reprocess failed messages  
✅ **Fault tolerance** - Better reliability for background processing  
✅ **Acknowledgment** - Track which messages have been processed  

This makes them ideal for **reliable distributed task processing**.

---

## 🛠️ Local Development Setup

### Prerequisites

- **Bun** (v1.3.5+)
- **Docker** & **Docker Compose**
- **PostgreSQL** (via Docker)
- **Redis** (via Docker)

### 1. Clone the Repository

```bash
git clone https://github.com/MrNikhillyadav/Betteruptime.git
cd Betteruptime
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Setup Environment Variables

Copy `.env.example` files and configure:

```bash
# Root .env.example
DATABASE_URL="postgresql://user:password@localhost:5432/betteruptime"
REDIS_URL="redis://localhost:6379"

# apps/api/.env
PORT=3001
JWT_SECRET_KEY="your-secret-key"

# apps/consumer/.env
WORKER_ID="worker-1"
CONSUMER_GROUP_REGION_ID="INDIA"

# apps/frontend/.env.local
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### 4. Start Infrastructure (Docker)

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port `5432`
- Redis on port `6379`

### 5. Run Database Migrations

```bash
bun run db:generate
bun run db:migrate:dev
```

### 6. Start Services

**Terminal 1 - API:**
```bash
bun run start:api
```

**Terminal 2 - Frontend:**
```bash
bun run start:frontend
```

**Terminal 3 - Pusher:**
```bash
bun run start:pusher
```

**Terminal 4 - Consumer:**
```bash
bun run start:consumer
```

### 7. Access the Application

- **Frontend:** http://localhost:3000
- **API:** http://localhost:3001

---

## 📦 Available Scripts

```bash
# Development
bun run dev              # Start all apps in dev mode
bun run build            # Build all apps

# Database
bun run db:generate      # Generate Prisma client
bun run db:migrate:dev   # Run database migrations

# Individual Services
bun run start:frontend   # Start Next.js frontend
bun run start:api        # Start Express API
bun run start:pusher     # Start Redis producer
bun run start:consumer   # Start Redis consumer

# Code Quality
bun run lint             # Run ESLint
bun run format           # Format code with Prettier
bun run check-types      # TypeScript type checking
```

---

## 🚀 Production Deployment

### Using Docker Compose

```bash
docker-compose -f docker-compose.prod.yml up -d
```

This will:
- Build all services
- Start PostgreSQL & Redis
- Run API, Frontend, Pusher, and Consumer(s)

### Scaling Consumers

Add more workers for higher throughput:

```bash
docker-compose -f docker-compose.prod.yml up -d --scale consumer=5
```

---

## ⚠️ Known Limitations / Planned Improvements

- [ ] Replace DB polling with **event-driven scheduler**
- [ ] Add **retry logic** and **dead-letter queues**
- [ ] Implement **smarter backoff** for flaky websites
- [ ] Add **rate limiting** per domain
- [ ] Move JWT from localStorage to **httpOnly cookies**
- [ ] Improve **time-series storage** (downsampling / cold storage)
- [ ] Better **multi-region failover** strategy
- [ ] Add **alerting** (email / webhook / Slack)
- [ ] Implement **health checks** for workers
- [ ] Add **metrics** and **observability** (Prometheus/Grafana)

---

## 📌 Goals of This Project

✅ Practice **real-world system design**  
✅ Explore **async and distributed processing**  
✅ Build something **scalable, not just functional**  
✅ Learn **tradeoffs** between different architectural choices  
✅ Understand **Redis Streams** and **consumer groups**  

---

## 🤝 Feedback & Contributions

This project is mainly a **learning and exploration effort**.

If you've built similar systems or see better ways to approach parts of this design, I'd love to hear your thoughts.  
**Suggestions, issues, and discussions are welcome!**

---

## 📜 License

MIT

---

## 📧 Contact

**Author:** MrNikhillyadav  
**GitHub:** [github.com/MrNikhillyadav](https://github.com/MrNikhillyadav)  
**Repository:** [Betteruptime](https://github.com/MrNikhillyadav/Betteruptime)

---

**⭐ If you found this project helpful, consider giving it a star!**
```
