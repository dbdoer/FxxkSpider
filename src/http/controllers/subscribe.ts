import { JsonController, Post, BodyParam, Get } from "routing-controllers";
import { initSubscriber, getSubscribersList } from "../../core/apis";

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

    @Get("/subscribe")
    private async getSubscribersList() {
        return await getSubscribersList();   
    }
}

export default SubscribeController;
