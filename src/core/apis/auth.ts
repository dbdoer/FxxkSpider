import { genNonDuplicateID } from "../helpers";
import * as md5 from "js-md5";
import { User } from "../model/user";
import { Context } from "vm";
import { UnauthorizedError } from "routing-controllers";

export const createUser = async (username: string, password: string) => {
    const salt = genNonDuplicateID(Math.floor(Math.random() * 10));

    const encryptPassword = md5(`${password}${salt}`);

    await User.create({
        username,
        salt,
        password: encryptPassword,
    });

    return {
        error: 0,
        msg: "成功",
    };
};

export const loginUser = async (username: string, password: string, ctx: Context) => {
    const u = await User.findOne({ username });
    const e = new Error(`Login false, username: ${username}, password: ${password}`);
    try {
        if (u) {
            const encryptPassword = md5(`${password}${u.salt}`);
            if (encryptPassword === u.password) {
                ctx.session.user = {
                    _id: u._id,
                    role: u.role,
                };
                return {
                    error: 0,
                    msg: "成功",
                    username: u.username,
                    role: u.role,
                };
            } else {
                throw e;
            }
        } else {
            throw e;
        }
    } catch (e) {
        console.error(e);
        throw new UnauthorizedError("用户名或密码错误");
    }
};
