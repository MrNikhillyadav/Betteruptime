import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken"
import { JWT_SECRET, PORT } from "./config.js";
import {prismaClient} from "@repo/store";
import authMiddleware from "./middleware.js";
import bcrypt from "bcryptjs";

const app = express();

app.use(cors());
app.use(express.json({ strict: false }));

app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password,5);
    try {
        const user = await prismaClient.user.create({
           data : {
             username,
             password: hashedPassword,
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

app.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await prismaClient.user.findFirst({ where: { username } });

        if (!user) {
            return res.status(400).send({ error: 'user not found ' });
        }
        const decodedPassword = await bcrypt.compare(password, user.password)

        if (!decodedPassword) {
            return res.status(400).send({ error: 'Invalid credentials' });
        }

        const token = await jwt.sign({
            id : user.id 
        },JWT_SECRET!)

        res.status(200).json({ token });
    } 
    catch (error) {
        res.status(500).send({ error: 'Server error' });
    }   
});

app.post("/website",authMiddleware ,async(req:Request,res:Response) => {
    const url = req.body.url;
    const userId = req.userId!;
    console.log("req.userId: ", userId);

    if(!url){
        res.status(411).json({
            message : "no url found"
        })
        return;
    }

   try{
        const website = await prismaClient.website.create({
            data : {
                url,
                userId,
            }
        })

        if(!website){
            res.json({
                message : "Not website added"
            })
            return;
        }

        res.status(201).json({
            message : "website added"
        })
   }
   catch(e){
        res.status(500).json({
            message : "Internal server error"
        })
   }

})

app.get("/status/:websiteId",authMiddleware, async(req,res) => {
    const websiteId = req.params.websiteId?.toString();

    try{
        const website = await prismaClient.website.findFirst({
            where : {
                id : websiteId,
                userId : req.userId
            },
            include: {
                ticks : {
                    orderBy : {
                        createdAt : "desc"
                    } // todo : []
                },  
            },
            take :  1
        })

        if(!website) {
            res.json({
                message : "Not found"
            })
            return;
        }

        console.log("website: ", website)

        res.json({
            id : website.id,
            url : website.url,
            userId : website.userId
        })
    }
    catch(e){
        res.status(500).json({
            message : "Internal server error"
        })
        return;
    }
     
})

app.listen(PORT,() => {
    console.log(`API server is running on PORT`, PORT);
})