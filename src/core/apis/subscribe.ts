import { Subscriber, Status, ISubscriber, Goods} from "../model";
import { scheduleJob } from "node-schedule";
import { getSteamPriceOverview, getSteamPrice, getItemNameId } from "../services";
import { sleep } from "../helpers";
import { IUser, ROLE } from "../model/user";

const subscribing = async (subscriber) => {
    const n = await Subscriber.countDocuments({ _id: subscriber._id });
    if (n > 0) {
        const steamPriceOverViewRes = await getSteamPriceOverview(subscriber.gameName, subscriber.marketHashName);
        await sleep(1000);
        const goods = await Goods.findOne({ marketHashName: subscriber.marketHashName });
        let steamAllPriceRes;
        if (goods && goods.itemNameId) {
            steamAllPriceRes = await getSteamPrice(goods.itemNameId);
        } else {
            const itemNameId = await getItemNameId(subscriber.gameName, subscriber.marketHashName);
            steamAllPriceRes = await getSteamPrice(itemNameId as string);
        }
        if (steamPriceOverViewRes && steamAllPriceRes) {
            await subscriber.updateOne({
                status: Status.success,
                volume: steamPriceOverViewRes.volume,
                steamMaxBuyPrice: steamAllPriceRes.steamMaxBuyPrice,
                steamMinSellPrice: steamAllPriceRes.steamMinSellPrice,
            });
            return true;
        } else {
            await subscriber.updateOne({
                status: Status.fail,
            });
            return true;
        }
    } else {
        return false;
    }
};

const createIntervalSubscriber = (subscriber: ISubscriber) => {
    const sj = scheduleJob(`*/${subscriber.intervals} * * * *`, function(nextSubscriber) {
        subscribing(nextSubscriber)
            .then((v) => {
                if (!v) {
                    console.log("Unsubscribe!");
                    sj.cancel();
                }
            });
    }.bind(null, subscriber));
};

export const restoreSubscribing = async () => {
    const subscribers = await Subscriber.find({});
    subscribers.forEach((s) => {
        createIntervalSubscriber(s);
    });
    return;
};

export const initSubscriber = async (user: IUser, gameName: string, marketHashName: string, intervals: number, verboseName: string) => {
    const subscriber = await Subscriber.create({
        user: user._id,
        marketHashName,
        gameName,
        intervals,
        verboseName,
    });

    subscribing(subscriber);
    createIntervalSubscriber(subscriber);
    return {
        error: 0,
        msg: "成功",
        data: subscriber,
    };
};

export const getSubscribersList = async (user: IUser) => {
    const conditions = user.role.includes(ROLE.ADMIN) ? {} : { user: user._id };
    return await Subscriber.find(conditions)
        .sort("-createdAt")
        .populate("user", "username");
};

export const deleteSubscricerById = async (user: IUser, id: string) => {
    const conditions = user.role.includes(ROLE.ADMIN) ? { _id: id } : { user: user._id, _id: id };
    await Subscriber.remove(conditions);
    return {
        error: 0,
        msg: "成功",
    };
};
