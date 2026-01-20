import { createClient } from "redis";

type WebsiteEvent = {url : string, id : string}

const client = await createClient()
.on("error", (err) => console.log("Redis Client Error", err))
.connect()

console.log("connected to Redis")

const STREAM_NAME = 'betteruptime:website';

export async function xAdd({url, id}:WebsiteEvent){
  await client.xAdd(
    STREAM_NAME, '*', {
      url,
      id
    }
  );
  
}

export async function xAddBulk(websites: WebsiteEvent[]) {
    await Promise.all(
        websites.map(website => 
            xAdd({
                url: website.url,
                id: website.id
            })
        )
    );
}

export async function xReadGroup(consumerGroup:string, workerId:string){
  const res = await client.xReadGroup(
    consumerGroup,
    workerId, {
      key: STREAM_NAME,
      id: '>'
    },{
      COUNT : 5
    }
  );

  //@ts-ignore
  let messages = res?.[0]?.messages ?? [];
  return messages;
}

export async function xAck(consumerGroup:string,eventId:string){
  await client.xAck(STREAM_NAME, consumerGroup, eventId)
}

export async function xAckBulk(consumerGroup:string,eventIds:string[]){
  await Promise.all(
    eventIds.map(eventId => xAck(consumerGroup, eventId))  // Await each, 
  );
}