import { fetchGoodsSteamPrice } from "./fetch_goods_steam_price";
import { generateGoodsData } from "./generate_goods_data";
import { fetchGoodsNameId } from "./fetch_goods_nameid";
import { scheduleJob } from "node-schedule";
import { Task } from "../src/core/model";
import { EventEmitter } from "events";

const jobWrapper = (ev: EventEmitter, jobFunc: (args?) => any, displayName: string) => async (args) => {
    try {
        await jobFunc(args);
        ev.emit(`${displayName}-success`);
    } catch (e) {
        ev.emit(`${displayName}-error`, `Job function run error! Name is ${displayName}，Err info:\n${e}`);
    }
};

(async () => {
    const newestTask = await Task.findOne({}, "-rawResult").sort("-createdAt");

    const ev = new EventEmitter();

    const fetchGoodsSteamPriceJob = scheduleJob("0 0 9 * * ?", jobWrapper(ev, fetchGoodsSteamPrice, "fetchGoodsSteamPrice").bind(null));

    const generateGoodsDataJob = scheduleJob("0 0 0 * * ?", jobWrapper(ev, generateGoodsData, "generateGoodsData").bind(null, newestTask._id));

    const fetchGoodsNameIdJob = scheduleJob("0 0 2 * * ?", jobWrapper(ev, fetchGoodsNameId, "fetchGoodsNameId"));

    ev.on("fetchGoodsSteamPrice-error", (e) => {
        console.error(e);
    });

    ev.on("generateGoodsData-error", (e) => {
        console.error(e);
    });

    ev.on("fetchGoodsNameId-error", (e) => {
        console.error(e);
    });

    ev.on("fetchGoodsSteamPrice-success", (e) => {
        console.log(`fetchGoodsSteamPrice next time is ${fetchGoodsSteamPriceJob.nextInvocation().toLocaleString()}`);
    });

    ev.on("generateGoodsData-success", (e) => {
        console.log(`generateGoodsData next time is ${generateGoodsDataJob.nextInvocation().toLocaleString()}`);
    });

    ev.on("fetchGoodsNameId-success", (e) => {
        console.log(`fetchGoodsNameId next time is ${fetchGoodsNameIdJob.nextInvocation().toLocaleString()}`);
    });

})();
