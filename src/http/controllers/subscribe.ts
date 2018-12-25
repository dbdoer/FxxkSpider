import { JsonController, Post, BodyParam } from "routing-controllers";
import { initSubscriber } from "../../core/apis";

@JsonController()
class SubscribeController {
    @Post("/subscribe")
    private async createSubscriber(
        @BodyParam("gameName", { required: true }) gameName: string,
        @BodyParam("marketHashName", { required: true }) marketHashName: string,
        @BodyParam("intervals", { required: true }) intervals: number,
    ) {
        return await initSubscriber(gameName, marketHashName, intervals);
    }
}

export default SubscribeController;
