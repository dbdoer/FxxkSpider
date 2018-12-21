import Axios from "axios";
import * as math from "mathjs";
import { IBuffGoodsListResponse, IBuffGoodsItem, IGoods, IBUffGoodsBillOrderResponse } from "../../@types/buffGoods";

export const getGoodsList = async (gameName: string, pageNum: number) => {
    const res = await Axios.get<IBuffGoodsListResponse>(`https://buff.163.com/api/market/goods?game=${gameName}&page_num=${pageNum}&page_size=1000`);
    return res.data;
};

export const getGoodsBillOrder = async (gameName: string, goodsId: string) => {
    const res = await Axios.get<IBUffGoodsBillOrderResponse>(`https://buff.163.com/api/market/goods/bill_order?game=${gameName}&goods_id=${goodsId}`);
    return res.data;
};

export const parseGoodsList = (goodsList: IBuffGoodsItem[]): IGoods[] => goodsList.map((g) => ({
    id: g.id,
    name: g.name,
    sell_min_price: g.sell_min_price,
    sell_num: g.sell_num,
    steam_market_url: g.steam_market_url,
    icon_url: g.goods_info.icon_url,
    steam_price: g.goods_info.steam_price,
    steam_price_cny: g.goods_info.steam_price_cny,
    diff_price: math.eval(`${g.sell_min_price} / ${g.goods_info.steam_price_cny}`), // 倍数
    original_discount_price: math.eval(`${g.sell_min_price} * 1.15 / ${g.goods_info.steam_price_cny} * 100`), // 原始折扣价
    original_profit: math.eval(`((${g.sell_min_price} * ${1 - (g.game === "dota2" ? 0.018 : 0.025)} - ${g.goods_info.steam_price_cny} * 0.82) / ${g.goods_info.steam_price_cny} * 0.82) * 100`), // 原始转回利润

    buff_goods_url: `https://buff.163.com/market/goods?goods_id=${g.id}`,
}));
