import * as React from "react";
import { autobind } from "core-decorators";
import Axios from "axios";
import { ITask } from "../core/model";

@autobind
class TaskCreate extends React.Component<any, { gameName: string, startPage: number, endPage: number, ms: string, task: ITask, selectType: string }> {
    public sto: any;
    constructor(arg) {
        super(arg);
        this.state = {
            gameName: "",
            startPage: 1,
            endPage: undefined,
            ms: "0",
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

    public handleSubmit(ev) {
        const { gameName, startPage, endPage, ms } = this.state;
        ev.preventDefault();
        Axios.post("/api/task", {
            gameName,
            startPage,
            endPage,
            ms: ms * 1000,
        })
            .then((res) => {
                if (res.data.error === 0) {
                    alert("创建成功");
                    this.props.history.push("/");
                }
            });
    }

    public handleValueChange(ev) {
        const newState = {};
        newState[ev.target.name] =  ev.target.value;
        this.setState(newState);
    }

    public render() {
        return (
            <section style={{ textAlign: "center" }}>
                <h1>创建任务单</h1>
                <form onSubmit={this.handleSubmit}>
                    <label>游戏名：</label>
                    <input type="text" onChange={this.handleValueChange} name="gameName"></input>
                    <br /><br />
                    <label>开始页数：</label>
                    <input type="number" onChange={this.handleValueChange} name="startPage"></input>
                    <br /><br />
                    <label>结束页数：</label>
                    <input type="number" onChange={this.handleValueChange} name="endPage"></input>
                    <br /><br />
                    <label>延时：</label>
                    <input type="text" onChange={this.handleValueChange} name="ms"></input>
                    <br /><br />
                    <button type="onSubmit">开始    ！</button>
                </form>
            </section>
        );
    }
}

export default TaskCreate;
