import * as React from "react";
import Axios from "axios";
import { ITask } from "../core/model";

class TaskList extends React.Component<{}, { dataSource: ITask[] }> {
    constructor(args) {
        super(args);
        this.state = {
            dataSource: [],
        };
    }

    public componentDidMount() {
        Axios.get("/api/task")
            .then((res) => this.setState({ dataSource: res.data }));
    }

    public renderStatus(status) {
        switch (status) {
            case -1:
                return "运行中";
            case 0:
                return "运行失败";
            case 1:
                return "成功！";
        }
    }

    public handleExport(task: ITask) {
        Axios.get(`/api/task/${task._id}/export`)
            .then((res) => {
                if (res.data.error === 0) {
                    location.reload();
                }
            });
    }

    public renderResultUrl(task: ITask) {
        if (task.status === 1) {
            if (task.resultUrl) {
                return <p>数据下载链接：<a href={`/${task.resultUrl}`}>{task.resultUrl}</a></p>;
            } else {
                return <p><button onClick={this.handleExport.bind(this, task)}>导出数据</button></p>;
            }
        }
    }

    public render() {
        const { dataSource } = this.state;
        return (
            <section>
                <h1>任务单列表：</h1>
                {dataSource.length > 0 ? dataSource.map((t) => (
                    <section style={ { background: "#818181", margin: "20px 20px", color: "white"  } }>
                        <p>描述：{t.desc}</p>
                        <p>创建时间：{new Date(t.createdAt).toLocaleTimeString()}</p>
                        <p>状态：{this.renderStatus(t.status)}</p>
                        {this.renderResultUrl(t)}
                    </section>
                )) : "还没有任务单或者任务单已经过期自动删除，点击右上方去创建吧！"}
            </section>
        );
    }
}

export default TaskList;
