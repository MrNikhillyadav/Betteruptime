import {prismaClient} from "@repo/store"
import {xAddBulk} from "@repo/redis-stream"

const websitesArr = [];

async function main(){
    const websites = await prismaClient.website.findMany({
       select : {
            id : true,
            url : true,
       }
    });

    console.log("websites length: ", websites.length);

   await xAddBulk(websites.map(w => ({
        url : w.url,
        id : w.id
   })))

}

setInterval(async () => {
    main()
}, 3 * 1000 * 60) 

main();