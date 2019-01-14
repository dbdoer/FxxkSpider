import * as Koa from "koa";
import * as serve from "koa-static";
import "reflect-metadata";
import { useKoaServer } from "routing-controllers";
import { httpConfig } from "../../config";
import TaskController from "./controllers/task";
import SubscribeController from "./controllers/subscribe";
import CookieController from "./controllers/cookie";
import MonitorController from "./controllers/monitor";

const createHttpServer = async () => {
    const koa = new Koa();

    // 前端静态资源服务
    if (httpConfig.IDENTITY === "development") {
        koa.use(serve(__dirname + "/../dashboard/build", {
            maxAge: 0,
        }));
    }

    // 数据报表资源服务
    koa.use(serve(__dirname + "/../core/export"));

    useKoaServer(koa, {
        routePrefix: "/api",
        controllers: [
            TaskController,
            SubscribeController,
            CookieController,
            MonitorController,
        ],
        classTransformer: false,
    });

    return koa;
};

export default createHttpServer;
