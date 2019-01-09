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

interface ITask extends mongoose.Document {
    status: StatusType;
    gameName: string;
    resultUrl: string;
    desc: string;
    rawResult: string;
    timeConsuming: string;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema({
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
}, { timestamps: true });

const Task = mongoose.model<ITask>("Task", taskSchema);

export {
    ITask,
    Task,
    StatusType,
    Status,
};
