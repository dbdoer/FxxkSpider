import { Goods } from "../src/core/model";
import { sleep } from "../src/core/helpers";
import { getSteamPrice, getSteamPriceOverview } from "../src/core/services";
import { ISteamPriceOverviewResponse } from "../src/core/@types";
import { jobConfig } from "../config";

export const fetchGoodsSteamPrice = async () => {
    let n = 1;
    const SLEEP_TIMING = jobConfig.SLEEP_TIMING.fetchGoodsSteamPriceJob;
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
                    // const priceOverviewRes = await getSteamPriceOverview(g.gameName, g.marketHashName);
                    // const volume = (priceOverviewRes as ISteamPriceOverviewResponse).volume || "";
                    // console.log(`Fetch Success! max: ${steamMaxBuyPrice}, min: ${steamMinSellPrice}, volume: ${volume}, time: ${new Date().toLocaleString()}`);
                    // await (g as any).updateOne({ steamMaxBuyPrice, steamMinSellPrice, volume });
                    console.log(`Fetch Success! max: ${steamMaxBuyPrice}, min: ${steamMinSellPrice}, time: ${new Date().toLocaleString()}`);
                    await (g as any).updateOne({ steamMaxBuyPrice, steamMinSellPrice });
                } catch (e) {
                    console.log(e);
                    await sleep(SLEEP_TIMING);
                    continue;
                }
                await sleep(SLEEP_TIMING);
            }
        }
        n = n + 1;
    }
};
