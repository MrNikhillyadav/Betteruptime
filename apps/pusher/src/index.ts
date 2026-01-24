import {prismaClient} from "@repo/store"
import {xAddBulk} from "@repo/redis-stream"

async function main() {
  try {
    const websites = await prismaClient.website.findMany({
      select: { id: true, url: true }
    });
    
    console.log("websites length:", websites.length);

    await xAddBulk(
      websites.map(w => ({ url: w.url, id: w.id }))
    );
  } catch (err) {
    console.error("Pusher error:", err);
  }
}


setTimeout(() => {
  main();
  setInterval(main, 3 * 60 * 1000);
}, 10_000);


// setInterval(async () => {
//     main()
// }, 3 * 1000 * 60) 

// main();