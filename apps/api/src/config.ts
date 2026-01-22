import "dotenv/config"; 

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const PORT = process.env.PORT || 3001;

export { JWT_SECRET_KEY, PORT };