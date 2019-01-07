import Axios from "axios";
import { ISteamPriceOverviewResponse } from "../../@types/buffGoods";
import * as request from "request";

const getGameId = (gameName: string) => {
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
    return appid;
};

export const getSteamPriceOverview = async (gameName: string, marketHashName: string) => {
    try {
        const url = `https://steamcommunity.com/market/priceoverview/?country=CN&currency=23&appid=${getGameId(gameName)}&market_hash_name=${encodeURI(marketHashName)}`;
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

export const getItemNameId = async (gameName: string, marketHashName: string) => {
    const url = `https://steamcommunity.com/market/listings/${getGameId(gameName)}/${encodeURI(marketHashName)}`;
    console.log(url);
    const fetchPromise = () => new Promise((resolve, reject) => {
        request({ url }, (err, res, body) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                const res = body.match(/Market_LoadOrderSpread\(\s*(\d*)\s*\)/);
                if (res) {
                    resolve(res[1]);
                } else {
                    reject(`Can't get getItemNameId, marketHashName is ${marketHashName}`);
                }
            }
        });
    });
    return await fetchPromise();
};
