import { Goods } from "../../model";

export const unsetSteamPriceForAllGoods = async () => {
    await Goods.updateMany({ itemNameId: {$exists: true} },
        { $unset: { steamMaxBuyPrice: 1, steamMinSellPrice: 1, volume: 1 } });
};
