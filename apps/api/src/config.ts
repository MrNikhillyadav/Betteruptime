import "dotenv/config"; 

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const PORT = process.env.PORT || 3001;

if (!JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY is not defined");
}

export { JWT_SECRET_KEY, PORT };