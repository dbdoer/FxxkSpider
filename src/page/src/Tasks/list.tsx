import * as React from "react";
import Axios from "axios";
import { autobind } from "core-decorators";
import { Card, Button, Spin, message } from "antd";
import { ITask } from "../../../core/model";
@autobind
class TaskList extends React.Component<{}, { dataSource: ITask[], progressString: string; }> {
    public poll: NodeJS.Timer;

    constructor(args) {
        super(args);
        this.state = {
            dataSource: [],
            progressString: "",
        };
    }

    public componentDidMount() {
        this.getTaskList();
    }

    public getTaskList() {
        Axios.get("/api/task")
            .then((res) => {
                const nowTask = res.data[0];
                if (nowTask && nowTask.status === -1) {
                    this.runPoll(this.getTaskDetail(nowTask._id));
                }
                this.setState({ dataSource: res.data });
            })
            .catch(() => {});
    }

    public componentWillUnmount() {
        clearTimeout(this.poll);
    }

    public runPoll(cb) {
        this.poll = setTimeout(() => {
            if (cb) {
                cb();
            }
            this.runPoll(cb);
        }, 2000);
    }

    public getTaskDetail(taskId) {
        return () => {
            Axios.get<ITask>(`/api/task/${taskId}`)
                .then((res) => {
                    if (res.data.status === 1) {
                        clearTimeout(this.poll);
                        this.getTaskList();
                        // const nowTask = res.data;
                        // this.setState((state) => ({ dataSource: state.dataSource.splice(0, 1, nowTask) }));
                    }
                })
                .catch(() => {});
        };
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
            })
            .catch(() => {});
    }

    public renderResultUrl(task: ITask) {
        if (task.status === 1) {
            if (task.resultUrl) {
                return <p>数据下载链接：<a href={`/${task.resultUrl}`}>{task.resultUrl}</a></p>;
            } else {
                return <p><Button type="primary" onClick={this.handleExport.bind(this, task)}>导出数据</Button></p>;
            }
        }
    }

    public handleTaskDelete(taskId: string) {
        Axios.delete(`/api/task/${taskId}`)
            .then((res) => {
                if (res.data.error === 0) {
                    message.success("删除成功");
                } else {
                    message.error("删除失败");
                }
                this.getTaskList();
            })
            .catch(() => {});
    }

    public render() {
        const { dataSource, progressString } = this.state;
        return (
            <section>
                <br />
                {dataSource.length > 0 ? dataSource.map((t, i) => (
                    <section key={t._id}>
                        <Spin spinning={t.status !== 1} delay={300}>
                            <Card title={t.desc} hoverable={true} extra={<Button onClick={this.handleTaskDelete.bind(this, t._id)}>删除</Button>}>
                                <p>创建时间：{new Date(t.createdAt).toLocaleTimeString()}</p>
                                <p>状态：{this.renderStatus(t.status)}{i === 0 ? progressString : null}</p>
                                {t.status === 1 ? <p>耗时：{t.timeConsuming}</p> : null}
                                {this.renderResultUrl(t)}
                            </Card>
                        </Spin>
                        <br />
                        <br />
                    </section>
                )) : "还没有任务单或者任务单已经过期自动删除，点击右上方去创建！"}
            </section>
        );
    }
}

export default TaskList;
