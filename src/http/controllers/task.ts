import { JsonController, Post, BodyParam, Get, Param } from "routing-controllers";
import { getGoodsListFromPage, getTask } from "../../core/apis";

@JsonController()
class TaskController {
    @Post("/task")
    private async createTask(
     @BodyParam("gameName", {required: true}) gameName: string,
     @BodyParam("startPage", {required: true}) startPage: number,
     @BodyParam("endPage", {required: true}) endPage: number,
     @BodyParam("ms", {required: true}) ms: number,
     ) {
        return await getGoodsListFromPage(gameName, startPage, endPage, ms);
    }

    @Get("/task/:id")
    private async getTask(@Param("id") id: string) {
        return await getTask(id);
    }
}

export default TaskController;
