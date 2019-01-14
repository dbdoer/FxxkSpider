import { JsonController, Get, Post } from "routing-controllers";
import { Goods } from "../../core/model";
import * as math from "mathjs";
import { jobConfig } from "../../../config";
import { unsetSteamPriceForAllGoods } from "../../core/helpers";

@JsonController()
class MonitorController {
    @Get("/monitor")
    private async getInformation() {
        const SteamAllNeedCrawl = await Goods.countDocuments({ itemNameId: { $exists: true } });
        const SteamHasBeenCrawl = await Goods.countDocuments({ itemNameId: { $exists: true }, steamMaxBuyPrice: { $exists: true }, steamMinSellPrice: { $exists: true } });
        const SteamDotA2NeedCrawl = await Goods.countDocuments({ itemNameId: { $exists: true }, gameName: "dota2" });
        const SteamDotA2HasBeenCrawl = await Goods.countDocuments({ itemNameId: { $exists: true }, gameName: "dota2", steamMaxBuyPrice: { $exists: true }, steamMinSellPrice: { $exists: true } });
        const SteamCsgoNeedCrawl = await Goods.countDocuments({ itemNameId: { $exists: true }, gameName: "csgo" });
        const SteamCsgoHasBeenCrawl = await Goods.countDocuments({ itemNameId: { $exists: true }, gameName: "csgo", steamMaxBuyPrice: { $exists: true }, steamMinSellPrice: { $exists: true } });
        return {
            SteamDotA2Proportion: Number(math.eval(`${SteamDotA2HasBeenCrawl} / ${SteamDotA2NeedCrawl} * 100`)).toFixed(2),
            SteamCsgoProportion: Number(math.eval(`${SteamCsgoHasBeenCrawl} / ${SteamCsgoNeedCrawl} * 100`)).toFixed(2),
            SteamDotA2NeedCrawl,
            SteamCsgoNeedCrawl,
            SteamDotA2HasBeenCrawl,
            SteamCsgoHasBeenCrawl,
            SteamProportion: Number(math.eval(`${SteamHasBeenCrawl} / ${SteamAllNeedCrawl} * 100`)).toFixed(2),
            SteamAllNeedCrawl,
            SteamHasBeenCrawl,
            SteamRemaining: math.eval(`${SteamAllNeedCrawl} - ${SteamHasBeenCrawl}`),
            RemainingTime: Number(math.eval(`(${SteamAllNeedCrawl} - ${SteamHasBeenCrawl}) * ${jobConfig.SLEEP_TIMING.fetchGoodsSteamPriceJob} / 1000 / 60`)).toFixed(2),
        };
    }

    @Get("/monitor/unset_steam_data")
    private async unsetSteamData() {
        await unsetSteamPriceForAllGoods();
        return {
            error: 0,
            msg: "成功",
        };
    }
}

export default MonitorController;
