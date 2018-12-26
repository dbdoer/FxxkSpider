import { Subscriber, Status, ISubscriber} from "../model";
import { scheduleJob } from "node-schedule";
import { getSteamPriceOverview } from "../services";
import { ISteamPriceOverviewResponse } from "../@types/buffGoods";

const subscribing = async (subscriber) => {
    const n = await Subscriber.countDocuments({ _id: subscriber._id });
    if (n > 0) {
        const res = await getSteamPriceOverview(subscriber.gameName, subscriber.marketHashName);
        if (res) {
            await subscriber.updateOne({
                status: Status.success,
                lowestPrice: (res as ISteamPriceOverviewResponse).lowest_price,
                volume: (res as ISteamPriceOverviewResponse).volume,
                medianPrice: (res as ISteamPriceOverviewResponse).median_price,
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
    const sj = scheduleJob(`*/${subscriber.intervals} * * * *`, function (nextSubscriber) {
        subscribing(nextSubscriber)
            .then(v => {
                if (!v) {
                    console.log("Unsubscribe!");
                    sj.cancel();
                }
            })
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

    subscribing(subscriber);
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
