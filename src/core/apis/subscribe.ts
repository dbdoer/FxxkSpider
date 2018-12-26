import { Subscriber, Status, ISubscriber} from "../model";
import { scheduleJob } from "node-schedule";
import { getSteamPriceOverview } from "../services";
import { ISteamPriceOverviewResponse } from "../@types/buffGoods";

const subscribing = async (subscriber, gameName, marketHashName) => {
    const res = await getSteamPriceOverview(gameName, marketHashName);
    if (res) {
        await subscriber.update({
            status: Status.success,
            lowestPrice: (res as ISteamPriceOverviewResponse).lowest_price,
            volume: (res as ISteamPriceOverviewResponse).volume,
            medianPrice: (res as ISteamPriceOverviewResponse).median_price,
        });
    } else {
        await subscriber.update({
            status: Status.fail,
        });
    }
};

const createIntervalSubscriber = (subscriber: ISubscriber) => {
    const sj = scheduleJob(`*/${subscriber.intervals} * * * *`, function (nextSubscriber) {
        try {
            subscribing(nextSubscriber, subscriber.gameName, subscriber.marketHashName);
        } catch (e) {
            console.log(e);
            sj.cancel();
        }
    }.bind(null, subscriber));
}

export const restoreSubscribing = async () => {
    const subscribers = await Subscriber.find({});
    subscribers.forEach((s) => {
        createIntervalSubscriber(s);
    });
    return;
};

export const initSubscriber = async (gameName: string, marketHashName: string, intervals: number) => {
    const subscriber = await Subscriber.create({
        marketHashName,
        gameName,
        intervals,
    });

    subscribing(subscriber, gameName, marketHashName);
    createIntervalSubscriber(subscriber);
    return {
        error: 0,
        msg: "成功",
        data: subscriber,
    };
};

export const getSubscribersList = async () => {
    return await Subscriber.find()
        .sort("-createdAt");
};

export const deleteSubscricerById = async (id: string) => {
    return await Subscriber.remove({ _id: id });
}
