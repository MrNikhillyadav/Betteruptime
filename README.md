# BetterUptime – Website Monitoring System

A BetterUptime-inspired website monitoring system built to explore **scalable system design**, **async processing**, and **real-world backend architecture**.

This project focuses on how to monitor a large number of websites efficiently, process checks asynchronously, and serve fast dashboards without overloading the database or backend.

---

## 🚀 Features

- User authentication (email + password)
- Add and manage website monitors
- Periodic uptime and response-time checks
- Region-based monitoring (e.g. India, USA)
- Async processing using Redis Streams
- Bulk database writes for efficiency
- Dashboard showing:
  - Current status (UP / DOWN)
  - Latest response time
  - Last 10 response-time ticks (graph-ready)

---

## 🧠 High-Level Architecture

The system is designed around **decoupling** and **asynchronous processing**.

- API handles user interactions and metadata
- Poller schedules monitoring work
- Workers perform network-heavy checks
- Database writes are batched
- Frontend consumes already-processed data

This ensures the system stays responsive even as the number of monitored websites grows.

---

## 🧱 Tech Stack

### Frontend
- Next.js

### Backend
- Bun
- Express.js
- Prisma ORM
- PostgreSQL

### Async / Background Processing
- Redis Streams
- Consumer Groups

### Monorepo
- Turborepo (initialized with Bun)

---

## 👤 User Flow

1. User signs up / logs in using email and password  
2. Backend issues a JWT (currently stored in localStorage)  
3. User lands on an empty dashboard  
4. User adds a website URL to monitor  
5. Backend stores website metadata in Postgres  
6. Monitoring happens asynchronously via background workers  

---

## ⏱️ Monitoring Flow (Backend)

1. A **poller (publisher)** runs every 3 minutes
2. It fetches website records from Postgres in bulk
3. Websites are pushed into a Redis Stream using `XADD`
4. Redis Streams distribute work across consumers using consumer groups
5. Consumers:
   - Hit the website URL
   - Measure response time
   - Determine UP / DOWN status
   - Push results to an internal queue
6. Results are **batched and written** to Postgres in a single operation

---

## 👥 Region-Based Consumers

- Separate Redis consumer groups per region (e.g. India, USA)
- Each group can have multiple workers
- Horizontal scaling is achieved by adding more consumers
- Load distribution is handled automatically by Redis Streams

---

## 📊 Frontend Data Flow

The frontend never performs heavy computation.

It simply fetches:
- Current website status
- Latest response time
- Last 10 response-time ticks

This data is already pre-aggregated in the database, making the UI fast and predictable.

---

## 🗄️ Database Design (High Level)

- `users` – authentication and ownership
- `websites` – website metadata
- `website_ticks` – response-time history
- Aggregated fields stored to avoid expensive reads

(Exact schema may evolve.)

---

## 🧪 Why Redis Streams?

Redis Streams were chosen over pub/sub or simple queues because they provide:

- Message persistence
- Consumer groups
- Automatic load distribution
- Message replay
- Better fault tolerance

This makes them suitable for reliable background processing.

---

## ⚠️ Known Limitations / Improvements

This is an evolving project. Some planned improvements:

- Replace DB polling with an event-driven scheduler
- Add retry logic and dead-letter queues
- Smarter backoff for flaky websites
- Rate limiting per domain
- Move JWT from localStorage to httpOnly cookies
- Improve time-series storage (downsampling / cold storage)
- Better multi-region failover strategy
- Alerting (email / webhook / Slack)

---

## 🛠️ Local Development (WIP)

> Detailed setup instructions will be added.

Planned:
- Docker setup for Postgres and Redis
- `.env` example
- Local worker + poller startup scripts

---

## 📌 Goals of This Project

- Practice real-world system design
- Explore async and distributed processing
- Build something scalable, not just functional
- Learn tradeoffs between different architectural choices

---

## 🤝 Feedback & Contributions

This project is mainly a learning and exploration effort.

If you’ve built similar systems or see better ways to approach parts of this design, I’d love to hear your thoughts.  
Suggestions, issues, and discussions are welcome.

---

## 📜 License

MIT (or to be decided)
