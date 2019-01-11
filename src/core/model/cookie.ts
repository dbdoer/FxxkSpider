import mongoose from "./conn";

const { Schema } = mongoose;

interface ICookie extends mongoose.Document {
    value: string;
}

const cookieSchema = new Schema({
    value: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Cookie = mongoose.model<ICookie>("Cookie", cookieSchema);

export {
    Cookie,
    ICookie,
};
