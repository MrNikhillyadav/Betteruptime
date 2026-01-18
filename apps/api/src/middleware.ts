import { NextFunction,Request,Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from "./config.js";

export default async function authMiddleware(req:Request,res:Response,next:NextFunction){

    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token' });
        }
        const token = authHeader.split(' ')[1];
    
        if(!token) {
    
            res.status(401).json({
                message : 'No token found!'
            })
            return;
        }
    
        const decodedPayload =  await jwt.verify(token, JWT_SECRET!) as { id: string };


        if(!decodedPayload) {
            res.status(403).json({
                message : "Invalid token"
            })
        }
        

        req.userId = decodedPayload.id;
        next();
        
    }
    catch(e){

        res.status(401).json({
            error : e
        })
        return;
    }

}