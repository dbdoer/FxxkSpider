import mongoose from "./conn";
import { IUser } from "./user";

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

interface ITask extends mongoose.Document {
    status: StatusType;
    gameName: string;
    resultUrl: string;
    desc: string;
    rawResult: string;
    timeConsuming: string;
    createdAt: Date;
    updatedAt: Date;
    type: string;
    user: string | IUser;
}

const taskSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: Number,
        required: true,
        default: StatusType.pending,
    },
    gameName: {
        type: String,
        required: true,
    },
    resultUrl: {
        type: String,
        required: false,
    },
    rawResult: {
        type: String,
        required: false,
    },
    desc: {
        type: String,
        required: true,
    },
    timeConsuming: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Task = mongoose.model<ITask>("Task", taskSchema);

export {
    ITask,
    Task,
    StatusType,
    Status,
};
