import { Goods } from "../src/core/model";
import { getItemNameId } from "../src/core/services";
import { sleep } from "../src/core/helpers";
import { jobConfig } from "../config";

export const fetchGoodsNameId = async () => {
    let n = 1;
    const SLEEP_TIMING = jobConfig.SLEEP_TIMING.fetchGoodsNameIdJob;
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
                    console.log(e.msg);
                    if (e.data.statusCode == 200) {
                        await Goods.deleteOne({ marketHashName: e.data.marketHashName });
                        console.log(`${e.data.marketHashName} has been removed!`);
                    } else {
                        return {
                            error: 1,
                            msg: e,
                        };
                    }
                    await sleep(SLEEP_TIMING);
                    continue;
                }
                console.log(`Fetch Success! name: ${g.marketHashName}, itemNameId: ${itemNameId}, time: ${new Date().toLocaleString()}`);
                await (g as any).updateOne({ itemNameId });
                await sleep(SLEEP_TIMING);
            }
        }
        n = n + 1;
    }
    return {
        error: 0,
    };
};
