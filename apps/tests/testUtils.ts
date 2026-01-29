import axios from "axios";
import { NEXT_PUBLIC_API_URL } from "./config";
import jwt from "jsonwebtoken"

export async function CreateUser():Promise<{userId:string, jwt : string}>{
    const username = crypto.randomUUID();  // Unique!

    const res = await axios.post(`${NEXT_PUBLIC_API_URL}/signup`, {
        username ,
        password : "testpass123"
    })

    const signInRes = await axios.post(`${NEXT_PUBLIC_API_URL}/signin`,{
        username ,
        password : "testpass123"
    })

    return {
        userId : res.data.id,
        jwt : signInRes.data.token,
    }
}


