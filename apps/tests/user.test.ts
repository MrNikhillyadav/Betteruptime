import axios from 'axios'
import {describe, expect, it} from 'bun:test'
import { BACKEND_URL } from './config'

export const USER_NAME = Math.random().toString();

describe("Signup endpoints", () => {
    it("User not able to signup if body is incorrect", async() => {
        try{
            await axios.post(`${BACKEND_URL}/signup`,{
                username : USER_NAME, 
                password : "testpass123"
            })
            expect(false, "Control shouldn't reach here")
        }catch(e){
            // console.log(e)
        }
    })
    it("User is able to signup if body is correct", async() => {
        try{
            const res = await axios.post(`${BACKEND_URL}/signup`,{
                username : USER_NAME, 
                password : "testpass123"
            })
            expect(res.status).toBe(201);
            expect(res.data.message).toBeDefined()
        }catch(e){
            // console.log(e)
        }
    })
})

describe("signin endpoints", () => {
    it("User not able to signin if body is incorrect", async() => {
        try{
            await axios.post(`${BACKEND_URL}/signin`,{
                username : USER_NAME, 
                password : "testpass123"
            })
            expect(false, "Control shouldn't reach here")
        }catch(e){
            console.log(e)
        }
    })

    it("User is able to signin if body is correct", async() => {
        try{
            const res = await axios.post(`${BACKEND_URL}/signin`,{
                username : USER_NAME, 
                password : "testpass123"
            })
            expect(res.status).toBe(200);
            expect(res.data.jwt).toBeDefined();
        }catch(e){
            console.log(e)
        }
    })
})