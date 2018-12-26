import Axios from "axios";
import { ISteamPriceOverviewResponse } from "../../@types/buffGoods";

export const getSteamPriceOverview = async (gameName: string, marketHashName: string) => {
    let appid;
    switch (gameName) {
        case "dota2":
            appid = 570;
            break;
        case "csgo":
            appid = 730;
            break;
        case "pubg":
            appid = 578080;
            break;
        default:
            return {
                status: false,
            };

    }
    try {
        const url = `https://steamcommunity.com/market/priceoverview/?country=CN&currency=23&appid=${appid}&market_hash_name=${encodeURI(marketHashName)}`;
        const res = await Axios.get<ISteamPriceOverviewResponse>(url);
        if (res.data.success) {
            return res.data;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
};
