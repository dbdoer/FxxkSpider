import { unsetSteamPriceForAllGoods } from "../src/core/helpers";

unsetSteamPriceForAllGoods()
    .then((res) => res ? process.exit(0) : {});
