import "dotenv/config"; 

import { xReadGroup, xAckBulk } from "@repo/redis-stream";
import { prismaClient } from "@repo/store";
import { CONSUMER_GROUP_REGION_ID, WORKER_ID } from "./config.js";
import axios from "axios";

async function fetchWebsite(url: string, websiteId: string) {
    const startTime = Date.now();
    try {
        await axios.get(url, { timeout: 10000 });
        const endTime = Date.now();

        const createTickResponse = await prismaClient.websiteTick.create({
            data: {
                responseTimeMs: endTime - startTime,
                status: "Up",
                regionId: CONSUMER_GROUP_REGION_ID,
                websiteId
            }
        }); 

        console.log("createTickResponse: ", createTickResponse)
    } 
    catch (error) {
        const endTime = Date.now();
        
        await prismaClient.websiteTick.create({
            data: {
                responseTimeMs: endTime - startTime,
                status: "Down",
                regionId: CONSUMER_GROUP_REGION_ID!,
                websiteId
            }
        });
    }
}

// {/* 
//     1. Worker starts → checks REGION_ID, WORKER_ID env vars
//     2. Infinite loop:
//     ├─ xReadGroup(REGION_ID, WORKER_ID) → gets batch of pending messages
//     ├─ For each message {url, id}:
//     │  └─ axios.get(url) → measure time → prisma.website_tick {Up/Down}
//     ├─ Promise.all() → wait for ALL fetches to complete (parallel)
//     ├─ xAckBulk() → acknowledge processed messages
//     └─ Repeat (or backoff if empty/error)      
// */}

console.log("CONSUMER_GROUP_REGION_ID: ",CONSUMER_GROUP_REGION_ID)
console.log("WORKER_ID: ",WORKER_ID)

if (!CONSUMER_GROUP_REGION_ID) {
    throw new Error("Consumer group name not provided");
}

if (!WORKER_ID) {
    throw new Error("worker_id not provided");
}


async function main() {
  
    while (true) {
        try {
            const response = await xReadGroup(CONSUMER_GROUP_REGION_ID, WORKER_ID);
            console.log("consumerresponse: ", response)

            if (!response || response.length === 0) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1s backoff
                continue;
            }

            // Process all messages in parallel
            const promises = response.map(({ message }: any) => 
                fetchWebsite(message.url, message.id)
            );
            
            await Promise.all(promises);
            
            // Ack only after all processing succeeds
            await xAckBulk(CONSUMER_GROUP_REGION_ID, response.map(({ id }: any) => id));
            
        } catch (error) {
            console.error("Worker error:", error);
            await new Promise(resolve => setTimeout(resolve, 5000)); // 5s backoff on error
        }
    }
}

main().catch(console.error);
    