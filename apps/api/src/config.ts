import "dotenv/config"; 

const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 3001;

export { JWT_SECRET, PORT };