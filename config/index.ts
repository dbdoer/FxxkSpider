import coreDevConfig from "./core.config.dev";
import httpDevConfig from "./http.config.dev";
import coreProdConfig from "./core.config.prod";
import httpProdConfig from "./http.config.prod";
import jobDevConfig from "./job.config.dev";
import jobProdConfig from "./job.config.prod";

const coreConfig: any = process.env.NODE_ENV === "development" ? coreDevConfig : coreProdConfig;

const httpConfig: any = process.env.NODE_ENV === "development" ? httpDevConfig : httpProdConfig;

const jobConfig: any = process.env.NODE_ENV === "development" ? jobDevConfig : jobProdConfig;

export {
    coreConfig,
    httpConfig,
    jobConfig,
};
