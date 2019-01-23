import { JsonController, Post, BodyParam, Get, Param, Delete, Authorized, Session } from "routing-controllers";
import { doTask, getTask, taskResultExport, getTaskList, deleteTask } from "../../core/apis";
import { IUser } from "../../core/model/user";

@Authorized()
@JsonController()
class TaskController {
    @Post("/task")
    private async createTask(
     @BodyParam("gameName", {required: true}) gameName: string,
     @BodyParam("startPage", {required: true}) startPage: number,
     @BodyParam("endPage", {required: true}) endPage: number,
     @BodyParam("type", {required: true}) type: string,
     @Session("user") user: IUser,
    ) {
        return await doTask(user._id, gameName, startPage, endPage, type);
    }

    @Get("/task/:id")
    private async getTask(@Param("id") id: string, @Session("user") user: IUser) {
        return await getTask(user, id);
    }

    @Get("/task/:id/export")
    private async exportTaskResult(@Param("id") id: string, @Session("user") user: IUser) {
        return await taskResultExport(user, id);
    }

    @Get("/task")
    private async getTaskList(@Session("user") user: IUser) {
        return await getTaskList(user);
    }

    @Delete("/task/:id")
    private async deleteTask(@Param("id") id: string, @Session("user") user: IUser) {
        return await deleteTask(user, id);
    }
}

export default TaskController;
