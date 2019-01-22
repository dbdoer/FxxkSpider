import { JsonController, Post, BodyParam, Ctx, Get, Session, UnauthorizedError, Authorized } from "routing-controllers";
import { createUser, loginUser } from "../../core/apis";
import { Context } from "koa";
import { IUser, ROLE } from "../../core/model/user";

@JsonController()
class AuthController {
    @Authorized()
    @Post("/signup")
    private async signUp(
        @BodyParam("username") username: string,
        @BodyParam("password") password: string,
        @Session("user") user: IUser,
    ) {
        if (user.role.includes(ROLE.ADMIN)) {
            return await createUser(username, password);
        } else {
            throw new UnauthorizedError();
        }
    }

    @Post("/login")
    private async loginUser(
        @BodyParam("username") username: string,
        @BodyParam("password") password: string,
        @Ctx() ctx: Context,
    ) {
        return await loginUser(username, password, ctx);
    }

    @Authorized()
    @Post("/logout")
    private async logout(@Ctx() ctx: Context) {
        ctx.session = null;
        return {
            error: 0,
            msg: "注销成功",
        };
    }

    @Get("/user")
    private async getUserInfo(@Session("user", { required: false }) user: IUser) {
        if (user) {
            const { username, role } = user;
            return {
                error: 0,
                msg: "已登录",
                username,
                role,
            };
        } else {
            throw new UnauthorizedError("未登录");
        }
    }
}

export default AuthController;
