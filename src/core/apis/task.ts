import * as moment from "moment";
import { getGoodsList, parseGoodsList } from "../services";
import { sleep } from "../helpers";
import { Task, Status } from "../model";

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
