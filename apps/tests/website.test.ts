import axios from "axios";
import {beforeAll, describe, expect, it} from "bun:test";
import { BACKEND_URL } from "./config";
import { CreateUser } from "./testUtils";

describe("User should be able to add website", () => {
    let token : string;
    
    beforeAll(async () => {
        const data = await CreateUser();
        token = data.jwt;
    })

    it("website not added if URL is not present", async() => {
       try{
            await axios.post(`${BACKEND_URL}/website`,{
            
            },{
                headers : {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            expect(false, "Website created when it shouldnt");
       }catch(e){
          console.log(e)
       }
    })
    
    it("website added if URL is present with header", async() => {
       try{
            const res = await axios.post(`${BACKEND_URL}/website`,{
                url : "https://google.com"
            },{
                headers : {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            expect(res.status).toBe(201),
            expect(res.data.message).toBeDefined()  
       }catch(e){
            console.log(e)
       }
    })

    it("website not add if header is missing ", async() => {
       try{
            const res = await axios.post(`${BACKEND_URL}/website`,{
                url : "https://google.com"
            }
        )
            expect("control shouldn't reach here")  
       }catch(e){
          console.log(e)
       }
    })
})