import mongoose from "./conn";
import { IUser } from "./user";

const { Schema } = mongoose;

enum StatusType {
    pending = -1,
    fail = 0,
    success = 1,
}

interface ISubscriber extends mongoose.Document {
    marketHashName: string;
    gameName: string;
    intervals: number;
    status: StatusType;
    volume: string;
    steamMaxBuyPrice: string;
    steamMinSellPrice: string;
    user: string | IUser;
}

const subscriberSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    marketHashName: {
        type: String,
        required: true,
    },
    gameName: {
        type: String,
        required: true,
    },
    verboseName: {
        type: String,
        required: true,
    },
    intervals: {
        type: Number,
        required: true,
        default: 60,
    },
    status: {
        type: Number,
        required: true,
        default: StatusType.pending,
    },
    steamMaxBuyPrice: {
        type: String,
        required: false,
    },
    steamMinSellPrice: {
        type: String,
        required: false,
    },
    volume: {
        type: String,
        required: false,
    },
}, { timestamps: true });

const Subscriber = mongoose.model<ISubscriber>("Subscriber", subscriberSchema);

export {
    ISubscriber,
    Subscriber,
};
