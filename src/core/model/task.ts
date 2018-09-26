import mongoose from "./conn";

const { Schema } = mongoose;

enum StatusType {
    pending = -1,
    fail = 0,
    success = 1,
}

interface ITask extends mongoose.Document {
    status: StatusType;
    resultUrl: string;
}

const taskSchema = new Schema({
    status: {
        type: Number,
        required: true,
        default: StatusType.pending,
    },
    resultUrl: {
        type: String,
        required: false,
    },
});

const Task = mongoose.model<ITask>("Task", taskSchema);

export {
    ITask,
    Task,
};
