import * as Koa from "koa";
import * as serve from "koa-static";
import "reflect-metadata";
import { useKoaServer, Action } from "routing-controllers";
import TaskController from "./controllers/task";
import SubscribeController from "./controllers/subscribe";
import CookieController from "./controllers/cookie";
import MonitorController from "./controllers/monitor";
import { restoreSubscribing, countUserById } from "../core/apis";
import AuthController from "./controllers/auth";
import { httpConfig } from "../../config";
import * as session from "koa-session";

const sessionConfig = {
    key: httpConfig.SESSION_KEY,
    maxAge: httpConfig.SESSION_MAXAGE,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
};

const createHttpServer = async () => {
    const koa = new Koa();

    koa.keys = httpConfig.KEYS;

    // 前端静态资源服务
    // if (httpConfig.IDENTITY === "development") {
    //     koa.use(serve(__dirname + "/../dashboard/build", {
    //         maxAge: 0,
    //     }));
    // }

    // 数据报表资源服务
    koa.use(serve(__dirname + "/../core/export"));

    koa.use(session(sessionConfig, koa));

    useKoaServer(koa, {
        routePrefix: "/api",
        controllers: [
            TaskController,
            SubscribeController,
            CookieController,
            MonitorController,
            AuthController,
        ],
        classTransformer: false,
        development: httpConfig.IDENTITY === "development",
        authorizationChecker: async (action: Action, roles: string[]) => {
            const s = action.context.session;
            const user = s.user;
            if (user) {
                const n = await countUserById(user._id);
                if (n === 1) {
                    return true;
                }
            }
            return false;
        },
    });

    {
        restoreSubscribing();
    }

    return koa;
};

export default createHttpServer;
