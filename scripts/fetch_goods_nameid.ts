import { Goods } from "../src/core/model";
import { getItemNameId } from "../src/core/services";
import { sleep } from "../src/core/helpers";

(async () => {
    let n = 1;
    while (true) {
        const allgoods = await Goods.find({ itemNameId: null }).limit(200);
        console.log(`round ${n}, need c ${allgoods.length}`);
        if (allgoods.length === 0) {
            console.log(`end!`);
            break;
        }
        for (const g of allgoods) {
            if (g) {
                let itemNameId;
                try {
                    itemNameId = await getItemNameId(g.gameName, g.marketHashName);
                } catch (e) {
                    console.log(e);
                    await sleep(15000);
                    continue;
                }
                console.log(`Fetch Success! name: ${g.marketHashName}, itemNameId: ${itemNameId}, time: ${new Date().toLocaleString()}`);
                await (g as any).updateOne({ itemNameId });
                await sleep(15000);
            }
        }
        n = n + 1;
    }
    process.exit(1);
})();
