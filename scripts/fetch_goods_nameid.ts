import { Goods } from "../src/core/model";
import { getItemNameId } from "../src/core/services";
import { sleep } from "../src/core/helpers";

(async () => {
    let n = 1;
    const needCNum = await Goods.countDocuments({ itemNameId: null });
    console.log(needCNum);
    while (true) {
        const allgoods = await Goods.find({ itemNameId: null }).limit(200).skip((n - 1) * 200);
        if (n * 200 > needCNum) {
            break;
        }
        for (const g of allgoods) {
            if (g) {
                let itemNameId;
                try {
                    itemNameId = await getItemNameId(g.gameName, g.marketHashName);
                } catch (e) {
                    continue;
                }
                console.log(itemNameId);
                await (g as any).updateOne({ itemNameId });
                await sleep(10000);
            }
        }
        n = n + 1;
    }
    process.exit(1);
})();
