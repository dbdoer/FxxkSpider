import mongoose from "./conn";

const { Schema } = mongoose;

interface IGoods extends mongoose.Document {
    marketHashName: string;
    gameName: string;
    itemNameId: string;
    steamMaxBuyPrice: string;
    steamMinSellPrice: string;
    volume: string;
}

const goodsSchema = new Schema({
    marketHashName: {
        type: String,
        required: true,
        index: true,
    },
    gameName: {
        type: String,
        required: true,
    },
    itemNameId: {
        type: String,
        required: false,
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
        // 24小时成交量
        type: String,
        required: false,
    },
}, { timestamps: true });

const Goods = mongoose.model<IGoods>("Goods", goodsSchema);

export {
    Goods,
    IGoods,
};
