import { Goods, Task, ITask } from "../src/core/model";

export const generateGoodsData = async () => {
    const newestDota2SellingTask = await Task.findOne({ gameName: "dota2", type: "selling" }).sort("-createdAt");
    const newestCsgoSellingTask = await Task.findOne({ gameName: "csgo", type: "buying" }).sort("-createdAt");

    for (const task of [newestDota2SellingTask, newestCsgoSellingTask]) {
        if (task) {
            const rawResult = JSON.parse(task.rawResult);
            for (const r of rawResult) {
                const n = await Goods.countDocuments({ marketHashName: r.market_hash_name, gameName: r.game });
                if (n === 0) {
                    try {
                        await Goods.create({
                            marketHashName: r.market_hash_name,
                            gameName: r.game,
                        });
                        console.log(`Insert ${r.market_hash_name} Success`);
                    } catch (e) {
                        continue;
                    }
                }
            }
        }
    }
    return true;
};
