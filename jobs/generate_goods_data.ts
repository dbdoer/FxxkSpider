import { Goods, Task } from "../src/core/model";

export const generateGoodsData = async (taskId: string) => {
    const t = await Task.findOne({ _id: taskId });
    const rawResult = JSON.parse(t.rawResult);
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
};
