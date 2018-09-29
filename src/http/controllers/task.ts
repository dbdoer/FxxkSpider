import { JsonController, Post, BodyParam, Get, Param } from "routing-controllers";
import { getGoodsListFromPage, getTask, taskResultExport, getTaskList } from "../../core/apis";

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

    @Get("/task/:id/export")
    private async exportTaskResult(@Param("id") id: string) {
        return await taskResultExport(id);
    }

    @Get("/task")
    private async getTaskList() {
        return await getTaskList();
    }
}

export default TaskController;
