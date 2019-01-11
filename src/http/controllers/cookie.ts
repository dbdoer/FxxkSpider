import { JsonController, Post, BodyParam } from "routing-controllers";
import { setCookie } from "../../core/apis";

@JsonController()
class CookieController {
    @Post("/cookie")
    private async setCookie(
        @BodyParam("value", { required: true }) value: string,
    ) {
        return await setCookie(value);
    }
}

export default CookieController;
