import { JsonController, Post, BodyParam, Get, Delete, Param, Authorized } from "routing-controllers";
import { initSubscriber, getSubscribersList, deleteSubscricerById } from "../../core/apis";

@Authorized()
@JsonController()
class SubscribeController {
    @Post("/subscribe")
    private async createSubscriber(
        @BodyParam("gameName", { required: true }) gameName: string,
        @BodyParam("marketHashName", { required: true }) marketHashName: string,
        @BodyParam("intervals", { required: true }) intervals: number,
        @BodyParam("verboseName", { required: true }) verboseName: string,
    ) {
        return await initSubscriber(gameName, marketHashName, intervals, verboseName);
    }

    @Get("/subscribe")
    private async getSubscribersList() {
        return await getSubscribersList();
    }

    @Delete("/subscribe/:id")
    private async deleteSubscriber(@Param("id") id: string) {
        return await deleteSubscricerById(id);
    }
}

export default SubscribeController;
