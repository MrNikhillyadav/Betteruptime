import "dotenv/config";
import express from "express";
import cors from "cors";
import { PORT } from "./config.js";
import {prismaClient} from "@repo/store";

const app = express();

app.use(cors());
app.use(express.json({ strict: false }));

app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await prismaClient.user.create({
           data : {
             username,
             password,
           }
        })
        
        if(!user) {
            return res.status(400).send({ error: 'Error creating user' });
        }

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).send({ error: 'Error creating user' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await prismaClient.user.findFirst({ where: { username } });

        if (!user) {
            return res.status(400).send({ error: 'user not found ' });
        }
        if (user.password !== password) {
            return res.status(400).send({ error: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }   
});


app.listen(PORT,() => {
    console.log(`API server is running on PORT`, PORT);
})