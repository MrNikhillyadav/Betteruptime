import axios from "axios";
import { BACKEND_URL } from "./config";
import jwt from "jsonwebtoken"

export async function CreateUser():Promise<{jwt : string}>{
    const username = crypto.randomUUID();  // Unique!

    await axios.post(`${BACKEND_URL}/signup`, {
        username ,
        password : "testpass123"
    })

    const signInRes = await axios.post(`${BACKEND_URL}/signin`,{
        username ,
        password : "testpass123"
    })

    return {
        jwt : signInRes.data.token,
    }
}


