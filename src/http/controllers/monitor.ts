import { JsonController, Get } from "routing-controllers";
import { Goods } from "../../core/model";
import * as math from "mathjs";
import { jobConfig } from "../../../config";

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
            RemainingTime: math.eval(`(${SteamAllNeedCrawl} - ${SteamHasBeenCrawl}) * ${jobConfig.SLEEP_TIMING.fetchGoodsSteamPriceJob} / 1000 / 60`),
        };
    }
}

export default MonitorController;
