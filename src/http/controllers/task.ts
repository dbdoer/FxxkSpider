import { JsonController, Post, BodyParam } from "routing-controllers";

@JsonController()
class TaskController {
    @Post("/task")
    private createTask(
     @BodyParam("gameName", {required: true}) gameName: string,
     @BodyParam("startPage", {required: true}) startPage: number,
     @BodyParam("endPage", {required: true}) endPage: number,
     @BodyParam("ms", {required: true}) ms: number,
     ) {
        // 创建任务单
    }
}

export default TaskController;
