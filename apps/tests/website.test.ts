import axios from "axios";
import {beforeAll, describe, expect, it} from "bun:test";
import { NEXT_PUBLIC_API_URL } from "./config";
import { CreateUser } from "./testUtils";

describe("User should be able to add website", () => {
    let token : string;
    
    beforeAll(async () => {
        const user = await CreateUser();
        token = user.jwt;
    })

    it("website not added if URL is not present", async() => {
       try{
            await axios.post(`${NEXT_PUBLIC_API_URL}/website`,{
            
            },{
                headers : {
                      token: token
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
            const res = await axios.post(`${NEXT_PUBLIC_API_URL}/website`,{
                url : "https://google.com"
            },{
                headers : {
                    token: token
                }
            }
        )
            expect(res.status).toBe(201),
            expect(res.data.id).toBeDefined()  
       }catch(e){
            console.log(e)
       }
    })

    it("website not add if header is missing ", async() => {
       try{
            const res = await axios.post(`${NEXT_PUBLIC_API_URL}/website`,{
                url : "https://google.com"
            }
        )
            expect("control shouldn't reach here")  
       }catch(e){
          console.log(e)
       }
    })
})

describe("user can fetch website",() =>{
    let token1 : string;
    let token2 : string;
    let userId1 : string;
    let userId2 : string;

    beforeAll(async() => {
        const user1 = await CreateUser();
        const user2 = await CreateUser();
        token1 = user1.jwt;
        userId1 = user1.userId;
        token2 = user2.jwt;
        userId2 = user2.userId;
        
    })

    it("Is able to fetch a website the user created",async() => {
        const websiteResponse = await axios.post(`${NEXT_PUBLIC_API_URL}/website`,
            { url: "https://google.com"},
            { headers : {token: token1  }})

        const getWebsiteResponse = await axios.get(`${NEXT_PUBLIC_API_URL}/status/${websiteResponse.data.id}`,{
            headers : { token : token1}
        })

        expect(getWebsiteResponse.data.id).toBe(websiteResponse.data.id);
        expect(getWebsiteResponse.data.userId).toBe(userId1)
    })

    it("Can't access website created by someone eles",async() => {
        const websiteResponse = await axios.post(`${NEXT_PUBLIC_API_URL}/website`,
            { url: "https://google.com"},
            { headers : {token: token1  }})

        const getWebsiteResponse = await axios.get(`${NEXT_PUBLIC_API_URL}/status/:${websiteResponse.data.id}`,{
            headers : { token : token2}
        })

        expect(false,"Should not be able to access website created by different user")
    })
})