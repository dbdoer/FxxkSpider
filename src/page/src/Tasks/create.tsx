import * as React from "react";
import { autobind } from "core-decorators";
import Axios from "axios";
import { ITask } from "../../../core/model";
import { Button, Input } from "antd";
import { roleHOC, ROLE } from "../Auth";

@autobind
class TaskCreate extends React.Component<{type: string}, { gameName: string, startPage: number, endPage: number, task: ITask, selectType: string }> {
    public sto: any;
    constructor(arg) {
        super(arg);
        this.state = {
            gameName: "",
            startPage: 1,
            endPage: undefined,
            task: null,
            selectType: "1",
        };
    }

    public runPoll(cb) {
        this.sto = setTimeout(() => {
            if (cb) {
                cb();
            }
            this.runPoll(cb);
        }, 1000);
    }

    // public getTaskDetail(taskId) {
    //     return () => {
    //         Axios.get<ITask>(`/api/task/${taskId}`)
    //             .then((res) => {
    //                 if (res.data.status === 1) {
    //                     clearTimeout(this.sto);
    //                     const task = res.data;
    //                     this.setState({
    //                         task,
    //                     });
    //                 }
    //         });
    //     };
    // }

    public handleSubmit() {
        const { gameName, startPage, endPage } = this.state;
        const { type } = this.props;
        Axios.post("/api/task", {
            gameName,
            startPage,
            endPage,
            type,
        })
            .then((res) => {
                if (res.data.error === 0) {
                    alert("创建成功，请等待任务单运行");
                    location.href = "/";
                }
            });
    }

    public handleValueChange(ev) {
        const newState = {};
        newState[ev.target.name] =  ev.target.value;
        this.setState(newState);
    }

    public render() {
        const { type } = this.props;
        return (
            <section className="center-section">
                <br /><br />
                <h2>{type === "selling" ? "这是爬取Buff出售价格的任务单" : "这是爬取Buff收购价格的任务单"}</h2>
                <br />
                <form>
                    <label>游戏名：（请输入 dota2，csgo或者pubg）</label>
                    <Input type="text" onChange={this.handleValueChange} name="gameName" style={{ width: "20%" }}></Input>
                    <br /><br />
                    <label>开始页数：（爬取开始的页数，一般为 1，平均一页1500条数据）</label>
                    <Input type="number" onChange={this.handleValueChange} name="startPage" style={{ width: "20%" }}></Input>
                    <br /><br />
                    <label>结束页数：（爬取结束的页数，填-1为最后一页）</label>
                    <Input type="number" onChange={this.handleValueChange} name="endPage" style={{ width: "20%" }}></Input>
                    <br /><br />
                    <Button type="primary" onClick={this.handleSubmit}>开始    ！</Button>
                </form>
            </section>
        );
    }
}

export default roleHOC(TaskCreate, ROLE.ADMIN, ROLE.USER);
