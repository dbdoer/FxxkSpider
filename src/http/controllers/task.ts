import { JsonController, Post, BodyParam, Get, Param, Delete, Authorized } from "routing-controllers";
import { doTask, getTask, taskResultExport, getTaskList, deleteTask } from "../../core/apis";

@Authorized()
@JsonController()
class TaskController {
    @Post("/task")
    private async createTask(
     @BodyParam("gameName", {required: true}) gameName: string,
     @BodyParam("startPage", {required: true}) startPage: number,
     @BodyParam("endPage", {required: true}) endPage: number,
     @BodyParam("type", {required: true}) type: string,
    ) {
        return await doTask(gameName, startPage, endPage, type);
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

    @Delete("/task/:id")
    private async deleteTask(@Param("id") id: string) {
        return await deleteTask(id);
    }
}

export default TaskController;
