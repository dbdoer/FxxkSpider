import { Goods } from "../src/core/model";
import { getItemNameId } from "../src/core/services";
import { sleep } from "../src/core/helpers";

(async () => {
    let n = 1;
    const needCNum = await Goods.countDocuments({ itemNameId: null });
    console.log(needCNum);
    while (true) {
        console.log(`round ${n}`);
        const allgoods = await Goods.find({ itemNameId: null }).limit(200);
        if (n * 200 > needCNum) {
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
