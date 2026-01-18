import {xReadGroupBulk, xAckBulk} from "@repo/redisstream"
import {prismaClient} from "@repo/store"
import { CONSUMER_GROUP_REGION_ID, WORKER_ID } from "./config.js";
import axios from "axios";


async function main(){
   while(1){
        if(!CONSUMER_GROUP_REGION_ID || !WORKER_ID){
            throw new Error("CONSUMER_GROUP_REGION_ID/Worker_id not provided")
        }
        const response = await xReadGroupBulk(CONSUMER_GROUP_REGION_ID,WORKER_ID);

        if(!response){
            continue;
        }

        const promsies = response.map(({messaage}:any) => {
            fetchWebsite(messaage.url, messaage.id);
            Promise.all(promsies);
        })

        xAckBulk(CONSUMER_GROUP_REGION_ID, response.map(({id}:any) => id))
   }
}

async function fetchWebsite(url:string, websiteId:string){
    return new Promise<void>((resolve, reject) => {
        const startTime = Date.now();
        axios.get(url)
        .then(async () =>{
            const endTime = Date.now();

             await prismaClient.websiteTick.create({
                data : {
                    responseTimeMs : endTime - startTime,
                    status : "Up",
                    regionId : CONSUMER_GROUP_REGION_ID!,
                    websiteId 
                }
            })
            resolve();
        })
        .catch(async () => {
            const endTime =  Date.now();
            await prismaClient.websiteTick.create({
                data : {
                    responseTimeMs : endTime - startTime,
                    status : "Up",
                    regionId : CONSUMER_GROUP_REGION_ID!,
                    websiteId 
                }
            })
            resolve();
        })
    })
}


main()
