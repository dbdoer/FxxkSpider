import mongoose from "./conn";

const { Schema } = mongoose;

enum StatusType {
    pending = -1,
    fail = 0,
    success = 1,
}

interface ISubscriber extends mongoose.Document {
    marketHashName: string;
    gameName: string;
    status: StatusType;
    lowestPrice: string;
    volume: string;
    medianPrice: string;
}

const subscriberSchema = new Schema({
    marketHashName: {
        type: String,
        required: true,
    },
    gameName: {
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
    lowestPrice: {
        type: String,
        required: false,
    },
    volume: {
        type: String,
        required: false,
    },
    medianPrice: {
        type: String,
        required: false,
    },
}, { timestamps: true });

const Subscriber = mongoose.model<ISubscriber>("Subscriber", subscriberSchema);

export {
    ISubscriber,
    Subscriber,
};
