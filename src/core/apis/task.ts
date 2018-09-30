import * as moment from "moment";
import { getGoodsList, parseGoodsList } from "../services";
import { sleep, range } from "../helpers";
import { Task, Status } from "../model";
import xlsx = require("better-xlsx");
import * as fs from "fs";

export const getGoodsListFromPage = async (gameName= "csgo", startPage: number = 1, endPage: number) => {

    const desc = `于${moment().format("YYYY-MM-DD, h:mm:ss a")}创建的爬取${gameName}，从第${startPage}页到第${endPage === -1 ? "最后一" : endPage}页的任务单`;
    const task = await Task.create({
        desc,
    });

    let res = [];

    try {
        (async () => {
            let nowPage = 1;
            const d = await getGoodsList(gameName, nowPage);
            // const promiseList = range(endPage);
            for (; nowPage <= endPage || endPage === -1; nowPage++) {
                const goodsList = await getGoodsList(gameName, nowPage);
                if (endPage === -1) {
                    endPage = goodsList.data.total_page;
                }
                console.log(nowPage, goodsList.data.items.length);
                res = [...res, ...goodsList.data.items.filter((g) => Number(g.sell_min_price) >= 2 && Number(g.sell_min_price) <= 3000)];
            }
            // await promiseList.forEach((p) => {
                // getGoodsList(gameName, p)
                // .then((goodsList) => {
                //     console.log(p, goodsList.data.items.length);
                //     res = [...res, ...goodsList.data.items.filter((g) => Number(g.sell_min_price) >= 2 && Number(g.sell_min_price) <= 3000)];
                // });
            // });
            const rawResult = JSON.stringify(parseGoodsList(res));
            const timeConsuming = `${(new Date().getTime() - new Date(task.createdAt).getTime()) / 1000}s`;
            await task.update({ status: Status.success, rawResult, timeConsuming });

            // .map((p) => getGoodsList(gameName, p)
            //     .then((goodsList) => {
            //         console.log(p, goodsList.data.items.length);
            //         res = [...res, ...goodsList.data.items.filter((g) => Number(g.sell_min_price) >= 2 && Number(g.sell_min_price) <= 3000)];
            //         return true;
            //     }));
            // Promise.all(promiseList)
            // .then(async () => {
                // const rawResult = JSON.stringify(parseGoodsList(res));
                // const timeConsuming = `${(new Date().getTime() - new Date(task.createdAt).getTime()) / 1000}s`;
                // await task.update({ status: Status.success, rawResult, timeConsuming });
            // });
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
    return await Task.findOne({ _id: taskId }, "-rawResult");
};

export const getTaskList = async () => {
    try {
        return await Task.find({}, "-rawResult")
        .sort("-createdAt");
    } catch (err) {
        await Task.remove({});
        return await Task.find({}, "-rawResult")
        .sort("-createdAt");
    }
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
    cell4.value = "倍数";
    const cell5 = row.addCell();
    cell5.value = "Buff在售数量";
    const cell6 = row.addCell();
    cell6.value = "原始折扣价（百分比）";
    const cell7 = row.addCell();
    cell7.value = "原始转回利润（百分比）";
    const cell8 = row.addCell();
    cell8.value = "Buff商品链接";

    const rawResult = JSON.parse(task.rawResult);
    rawResult.forEach((r) => {
        const dataRow = sheet.addRow();
        const dataCell1 = dataRow.addCell();
        const dataCell2 = dataRow.addCell();
        const dataCell3 = dataRow.addCell();
        const dataCell4 = dataRow.addCell();
        const dataCell5 = dataRow.addCell();
        const dataCell6 = dataRow.addCell();
        const dataCell7 = dataRow.addCell();
        const dataCell8 = dataRow.addCell();
        dataCell1.value = r.name;
        dataCell2.value = r.sell_min_price;
        dataCell3.value = r.steam_price_cny;
        dataCell4.value = Math.floor(r.diff_price);
        dataCell5.value = r.sell_num;
        dataCell6.value = r.original_discount_price;
        dataCell7.value = r.original_profit;
        dataCell8.value = r.buff_goods_url;
    });

    const fileName = `${Math.random() * 1000000}.xlsx`;

    file
        .saveAs()
        .pipe(fs.createWriteStream(__dirname + `/../export/${fileName}`));

    await task.update({ resultUrl: fileName });

    return {
        error: 0,
        msg: "成功",
        data: {},
    };
};
