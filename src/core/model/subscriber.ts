import mongoose from "./conn";

const { Schema } = mongoose;

enum StatusType {
    pending = -1,
    fail = 0,
    success = 1,
}

const Status = {
    pending: -1,
    fail: 0,
    success: 1,
};

interface ISubscriber extends mongoose.Document {
    market_hash_name: string;
    gameName: string;
    status: StatusType;
    lowest_price: string;
    volume: string;
    median_price: string;
}

const subscriberSchema = new Schema({
    market_hash_name: {
        type: String,
        required: true,
    },
    gameName: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        required: true,
        default: StatusType.pending,
    },
    lowest_price: {
        type: String,
        required: false,
    },
    volume: {
        type: String,
        required: false,
    },
    median_price: {
        type: String,
        required: false,
    },
}, { timestamps: true });

const Subscriber = mongoose.model<ISubscriber>("Subscriber", subscriberSchema);

export {
    ISubscriber,
    Subscriber,
    StatusType,
    Status,
};
