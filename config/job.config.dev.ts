export default {
    CRONRULE: {
        fetchGoodsSteamPriceJob: "0 0 9 * * ?",
        generateGoodsDataJob: "0 0 0 * * ?",
        fetchGoodsNameIdJob: "0 0 1 * * ?",
        taskFlushJob: "0 0 0 * * ?",
    },
    SLEEP_TIMING: {
        fetchGoodsSteamPriceJob: 1500,
        fetchGoodsNameIdJob: 15000
    }
};
