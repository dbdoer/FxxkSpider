import Axios from "axios";
import { IBuffGoodsListResponse, IBuffGoodsItem, IGoods } from "../../@types/buffGoods";

export const getGoodsList = async (gameName: string, pageNum: number) => {
    const res = await Axios.get<IBuffGoodsListResponse>(`https://buff.163.com/api/market/goods?game=${gameName}&page_num=${pageNum}&page_size=1500`);
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
    diff_price: Number(g.goods_info.steam_price_cny) - Number(g.sell_min_price),

    buff_goods_url: `https://buff.163.com/market/goods?goods_id=${g.id}`,
}));
