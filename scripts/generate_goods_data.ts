import { generateGoodsData } from "../jobs";

generateGoodsData()
    .then((res) => res ? process.exit(0) : {});
