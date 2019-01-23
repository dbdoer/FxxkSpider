import { JsonController, Post, BodyParam, Get, Delete, Param, Authorized, Session } from "routing-controllers";
import { initSubscriber, getSubscribersList, deleteSubscricerById } from "../../core/apis";
import { IUser } from "../../core/model/user";

@Authorized()
@JsonController()
class SubscribeController {
    @Post("/subscribe")
    private async createSubscriber(
        @BodyParam("gameName", { required: true }) gameName: string,
        @BodyParam("marketHashName", { required: true }) marketHashName: string,
        @BodyParam("intervals", { required: true }) intervals: number,
        @BodyParam("verboseName", { required: true }) verboseName: string,
        @Session("user") user: IUser,
    ) {
        return await initSubscriber(user, gameName, marketHashName, intervals, verboseName);
    }

    @Get("/subscribe")
    private async getSubscribersList(@Session("user") user: IUser) {
        return await getSubscribersList(user);
    }

    @Delete("/subscribe/:id")
    private async deleteSubscriber(@Param("id") id: string, @Session("user") user: IUser) {
        return await deleteSubscricerById(user, id);
    }
}

export default SubscribeController;
