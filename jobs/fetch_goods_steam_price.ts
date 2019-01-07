import { Goods } from "../src/core/model";
import { sleep } from "../src/core/helpers";
import { getSteamPrice, getSteamPriceOverview } from "../src/core/services";
import { ISteamPriceOverviewResponse } from "../src/core/@types";

export const fetchGoodsSteamPriceJob = async () => {
    let n = 1;
    while (true) {
        const allgoods = await Goods.find({ itemNameId: { $exists: true }, steamMaxBuyPrice: null, steamMinSellPrice: null }).limit(200);
        console.log(`round ${n}, need c ${allgoods.length}`);
        if (allgoods.length === 0) {
            console.log(`end!`);
            break;
        }
        for (const g of allgoods) {
            if (g) {
                try {
                    const { steamMaxBuyPrice, steamMinSellPrice } = await getSteamPrice(g.itemNameId);
                    const priceOverviewRes = await getSteamPriceOverview(g.gameName, g.marketHashName);
                    const volume = (priceOverviewRes as ISteamPriceOverviewResponse).volume || "";
                    console.log(`Fetch Success! max: ${steamMaxBuyPrice}, min: ${steamMinSellPrice}, volume: ${volume}, time: ${new Date().toLocaleString()}`);
                    await (g as any).updateOne({ steamMaxBuyPrice, steamMinSellPrice, volume });
                } catch (e) {
                    console.log(e);
                    await sleep(2000);
                    continue;
                }
                await sleep(2000);
            }
        }
        n = n + 1;
    }
};
