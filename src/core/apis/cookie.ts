import { Cookie } from "../model/cookie";

export const setCookie = async (value: string) => {
    await Cookie.create({
        value,
    });
    return {
        error: 0,
        msg: "成功",
    };
};
