import { JsonController, Post, BodyParam, Ctx } from "routing-controllers";
import { createUser, loginUser } from "../../core/apis";
import { Context } from "koa";

@JsonController()
class AuthController {
    @Post("/signup")
    private async signUp(
        @BodyParam("username") username: string,
        @BodyParam("password") password: string,
    ) {
        return await createUser(username, password);
    }

    @Post("/login")
    private async loginUser(
        @BodyParam("username") username: string,
        @BodyParam("password") password: string,
        @Ctx() ctx: Context,
    ) {
        return await loginUser(username, password, ctx);
    }
}

export default AuthController;
