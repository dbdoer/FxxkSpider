import { JsonController, Post, BodyParam } from "routing-controllers";
import { initSubscriber } from "../../core/apis";

@JsonController()
class SubscribeController {
    @Post("/subscribe")
    private async createSubscriber(
        @BodyParam("gameName", { required: true }) gameName: string,
        @BodyParam("market_hash_name", { required: true }) marketHashName: string,
    ) {
        return await initSubscriber(gameName, marketHashName);
    }
}

export default SubscribeController;
