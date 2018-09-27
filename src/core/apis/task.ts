import * as moment from "moment";
import { getGoodsList, parseGoodsList } from "../services";
import { sleep } from "../helpers";
import { Task, Status } from "../model";
import xlsx = require("better-xlsx");
import * as fs from "fs";

export const getGoodsListFromPage = async (gameName= "csgo", startPage: number = 1, endPage: number, ms: number) => {
    let res = [];

    const desc = `于${moment().format("YYYY-MM-DD, h:mm:ss a")}创建的爬取${gameName}，从第${startPage}页到第${endPage}页的时间间隔为${ms / 1000}s的任务单`;
    const task = await Task.create({
        desc,
    });

    try {
        (async () => {
            for (let nowPage = startPage; nowPage <= endPage; nowPage++) {
                const goodsList = await getGoodsList(gameName, nowPage);
                res = [...res, ...goodsList.data.items];
                nowPage = nowPage + 1;
                await sleep(ms);
            }
            const rawResult = JSON.stringify(parseGoodsList(res));
            await task.update({ status: Status.success, rawResult });
        })();
    } catch (err) {
        await task.update({ status: Status.fail });
    }

    return {
        error: 0,
        msg: "成功",
        data: task,
    };
};

export const getTask = async (taskId: string) => {
    return await Task.findOne({ _id: taskId });
};

export const taskResultExport = async (taskId: string) => {
    const task = await Task.findOne({ _id: taskId });
    const file = new xlsx.File();
    const sheet = file.addSheet("DefaultSheet");

    const row = sheet.addRow();
    const cell1 = row.addCell();
    cell1.value = "商品名";
    const cell2 = row.addCell();
    cell2.value = "Buff出售最低价（单位：元）";
    const cell3 = row.addCell();
    cell3.value = "steam出售价格（单位：元）";
    const cell4 = row.addCell();
    cell4.value = "价差（单位：元）";
    const cell5 = row.addCell();
    cell5.value = "Buff商品链接";

    const rawResult = JSON.parse(task.rawResult);
    rawResult.forEach((r) => {
        const dataRow = sheet.addRow();
        const dataCell1 = dataRow.addCell();
        const dataCell2 = dataRow.addCell();
        const dataCell3 = dataRow.addCell();
        const dataCell4 = dataRow.addCell();
        const dataCell5 = dataRow.addCell();
        dataCell1.value = r.name;
        dataCell2.value = r.sell_min_price;
        dataCell3.value = r.steam_price_cny;
        dataCell4.value = Math.floor(r.diff_price);
        dataCell5.value = r.buff_goods_url;
    });

    file
        .saveAs()
        .pipe(fs.createWriteStream(__dirname + `/../export/${Math.random() * 1000000}.xlsx`));

    return {
        error: 0,
        msg: "成功",
        data: {},
    };
};
