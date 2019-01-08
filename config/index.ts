import coreDevConfig from "./core.config.dev";
import httpDevConfig from "./http.config.dev";
import coreProdConfig from "./core.config.prod";
import httpProdConfig from "./http.config.prod";

const coreConfig: any = process.env.NODE_ENV === "development" ? coreDevConfig : coreProdConfig;

const httpConfig: any = process.env.NODE_ENV === "development" ? httpDevConfig : httpProdConfig;

export {
    coreConfig,
    httpConfig,
};
