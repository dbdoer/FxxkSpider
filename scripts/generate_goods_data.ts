import { Goods, Task } from "../src/core/model";

(async () => {
    const t = await Task.findOne({ _id: "5c31e944307366930a9c7f31" });
    const rawResult = JSON.parse(t.rawResult);
    for (const r of rawResult) {
        const n = await Goods.countDocuments({ marketHashName: r.market_hash_name, gameName: r.game });
        if (n === 0) {
            try {
                await Goods.create({
                    marketHashName: r.market_hash_name,
                    gameName: r.game,
                });
            } catch (e) {
                continue;
            }
        }
    }
    process.exit(0);
})();
