import { createClient } from "redis";

type WebsiteEvent = {url : string, id : string}

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not set");
}

const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => {
  console.error("Redis Client Error", err);
});

await client.connect();

const STREAM_NAME = "betteruptime:website";
const DEFAULT_CONSUMER_GROUP = "1";

/**
 * Ensure stream + consumer group exist.
 * This must run once on startup.
 */

async function ensureConsumerGroup() {
  try {
    await client.xGroupCreate(
      STREAM_NAME,
      DEFAULT_CONSUMER_GROUP,
      "0",
      { MKSTREAM: true }
    );
    console.log(
      `Redis consumer group '${DEFAULT_CONSUMER_GROUP}' created`
    );
  } catch (err: any) {
    // BUSYGROUP = group already exists → safe to ignore
    if (!err?.message?.includes("BUSYGROUP")) {
      throw err;
    }
  }
}

await ensureConsumerGroup();

/* ---------------- STREAM PRODUCERS ---------------- */

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

/* ---------------- STREAM CONSUMERS ---------------- */

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