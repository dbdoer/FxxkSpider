import { Subscriber, Status} from "../model";
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

export const initSubscriber = async (gameName: string, marketHashName: string, intervals: number) => {
    const subscriber = await Subscriber.create({
        marketHashName,
        gameName,
        intervals,
    });

    subscribing(subscriber, gameName, marketHashName);
    const sj = scheduleJob(`*/${intervals} * * * *`, function (nextSubscriber) {
        console.log("Subscriber subscribing");
        console.log(sj.nextInvocation());
        subscribing(nextSubscriber, gameName, marketHashName);
    }.bind(null, subscriber));
    return {
        error: 0,
        msg: "成功",
        data: subscriber,
    };
};
