import Axios from "axios";
import { ISteamPriceOverviewResponse } from "../../@types/buffGoods";
import * as request from "request";
import { getGameId } from "../../helpers";

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
                    reject(`Can't get getItemNameId, marketHashName is ${marketHashName}, body is ${body}, res is ${res}`);
                }
            }
        });
    });
    return await fetchPromise();
};

export const getSteamPrice = async (itemNameId: string) => {
    try {
        const url = `https://steamcommunity.com/market/itemordershistogram?country=CN&language=schinese&currency=23&item_nameid=${itemNameId}&two_factor=0`;
        const res = await Axios.get(url);
        if (res.data.success) {
            return {
                steamMaxBuyPrice: `¥ ${res.data.buy_order_graph[0][0] || ""}`,
                steamMinSellPrice: `¥ ${res.data.sell_order_graph[0][0] || ""}`,
            };
        }
    } catch (e) {
        console.log(`getSteamPrice Err! ItemNameId is ${itemNameId}, Err inf:\n${e}`);
        return {
            steamMaxBuyPrice: "",
            steamMinSellPrice: "",
        };
    }
};
