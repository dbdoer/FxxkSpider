import * as React from "react";
import { autobind } from "core-decorators";
import Axios from "axios";
import { ITask } from "../core/model";

@autobind
class App extends React.Component<any, { gameName: string, startPage: number, endPage: number, ms: number, task: ITask, showResult: any, selectType: string }> {
    public sto: any;
    constructor(arg) {
        super(arg);
        this.state = {
            gameName: "",
            startPage: 1,
            endPage: undefined,
            ms: undefined,
            task: null,
            showResult: [],
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

    public getTaskDetail(taskId) {
        return () => {
            Axios.get<ITask>(`/api/task/${taskId}`)
                .then((res) => {
                    if (res.data.status === 1) {
                        clearTimeout(this.sto);
                        const task = res.data;
                        this.setState({
                            task,
                            showResult: JSON.parse(task.rawResult),
                        });
                    }
            });
        };
    }

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
                    const taskId = res.data.data._id;
                    this.runPoll(this.getTaskDetail(taskId));
                }
            });
    }

    public handleValueChange(ev) {
        const newState = {};
        newState[ev.target.name] =  ev.target.value;
        this.setState(newState);
    }

    public handleSelectChange(ev) {
        try {
            const type = ev.target.value;
            const { task } = this.state;
            const rawResult = task.rawResult;
            if (type === "2") {
                const d = JSON.parse(rawResult).sort((a, b) => Math.floor(b.diff_price) - Math.floor(a.diff_price));
                this.setState({
                    showResult: [...d],
                    selectType: "2",
                });
            } else {
                const d = JSON.parse(rawResult);
                this.setState({
                    showResult: [...d],
                    selectType: "1",
                });
            }
        } catch (err) {
            alert("未取得任务单数据");
        }

    }

    public render() {
        const { showResult, selectType } = this.state;
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
                    <br /><br />
                    <p>
                        排序规则：
                        <select onChange={this.handleSelectChange} value={selectType}>
                            <option value={1}>默认（buff规则）</option>
                            <option value={2}>价差降序</option>
                        </select>
                    </p>
                    <ul>
                        {showResult.map((v) => (
                            <li key={v.id}>
                                名称：{v.name}<br /><br />
                                buff出售价格：{v.sell_min_price}元<br /><br />
                                steam出售价格：{v.steam_price_cny}元<br /><br />
                                价差：{v.diff_price}<br /><br />
                                <img src={v.icon_url} onClick={() => window.open(v.buff_goods_url)} style={{ width: "80px" }} /><br /><br />
                                <hr />
                            </li>
                        ))}
                    </ul>
                </form>
            </section>
        );
    }
}

export default App;
