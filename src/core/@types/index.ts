export interface IBuffGoodsSellingListResponse {
    code: string;
    data: {
        items: IBuffGoodsSellingItem[];
        page_num: number;
        page_size: number;
        total_count: number;
        total_page: number;
    };
    msg: string;
}

export interface IBUffGoodsBillOrderResponse {
    code: string;
    msg: string;
    data: {
        has_market_stores: object,
        items: IBuffGoodsBillOrderItem[],
    };
}

export interface IBuffGoodsBillOrderItem {
    price: string;
}

export interface IBuffGoodsSellingItem {
    id: number;
    name: string;
    market_hash_name: string;
    sell_min_price: string;
    sell_num: number;
    steam_market_url: string;
    game: string;
    goods_info: {
        icon_url: string;
        steam_price: string;
        steam_price_cny: string;
    };
}

export interface ISteamPriceOverviewResponse {
    success: boolean;
    lowest_price: string;
    volume: string;
    median_price: string;
}

export interface IBuffGoodsBuyingListResponse {
    code: string;
    data: {
        items: IBuffGoodsBuyingItem[];
        page_num: number;
        page_size: number;
        total_count: number;
        total_page: number;
    };
    msg: string;
}

export interface IBuffGoodsBuyingItem {
    id: number;
    name: string;
    market_hash_name: string;
    steam_market_url: string;
    buy_max_price: string;
    buy_num: number;
    game: string;
    sell_min_price: string;
    sell_num: number;
}
