import { createClient } from "redis";

type WebsiteEvent = {url : string, id : string}

const client = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

const STREAM_NAME = 'betteruptime:website';

async function xAdd({url, id}:WebsiteEvent){
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
    }, {
      COUNT: 5
    }
  );

  console.log("res: ", res);
  //@ts-ignore
  let messages = res?.[0]?.messages;

  return messages;
}

async function xAck(consumerGroup:string,eventId:string){
  await client.xAck(STREAM_NAME, consumerGroup, eventId)
}

async function xAckBulk(consumerGroup:string,eventIds:string[]){
  eventIds.map(eventId => xAck(consumerGroup,eventId));
}