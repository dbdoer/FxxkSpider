import * as React from "react";
import { Button, Input, List, Card } from "antd";
import { autobind } from "core-decorators";
import Axios from "axios";
import { ISubscriber } from "../../../core/model";

const getGameId = (gameName: string) => {
    switch (gameName) {
        case "dota2":
            return "570";
        case "csgo":
            return "730";
        case "pubg":
            return "578080";
        default:
            return "570";
    }
};

@autobind
class GoodsSubscribe extends React.Component<any, { gameName: string, marketHashName: string, intervals: number, verboseName: string, dataSource: ISubscriber[] }> {
    constructor(args) {
        super(args);
        this.state = {
            gameName: "",
            marketHashName: "",
            verboseName: "",
            intervals: null,
            dataSource: [],
        };
    }

    public componentDidMount() {
        Axios.get("/api/subscribe")
            .then((res) => {
                this.setState({
                    dataSource: res.data,
                });
            });
    }

    public handleValueChange(ev) {
        const newState = {};
        newState[ev.target.name] =  ev.target.value;
        this.setState(newState);
    }

    public handleSubmit() {
        const { gameName, marketHashName, intervals, verboseName } = this.state;
        Axios.post("/api/subscribe", {
            gameName,
            marketHashName,
            intervals,
            verboseName,
        })
            .then((res) => {
                if (res.data.error === 0) {
                    location.reload();
                }
            });
    }

    public handleDeleteSubscriber(id) {
        Axios.delete(`/api/subscribe/${id}`)
            .then((res) => {
                location.reload();
            });
    }

    public render() {
        const { dataSource: subscribers } = this.state;

        const totalSum = subscribers.filter((v) => v.status === 1).reduce((pv, cv) => {
            let nowPrice;
            if (cv.medianPrice) {
                nowPrice = Number(cv.medianPrice.replace(",", "").substr(2));
            } else {
                nowPrice = Number(cv.lowestPrice.replace(",", "").substr(2));
            }
            return pv + nowPrice;
        }, 0);

        return (
            <section className="center-section">
                <br />
                <form>
                    <label>游戏名（请输入 dota2，csgo或者pubg）</label>
                    <Input type="text" onChange={this.handleValueChange} name="gameName" style={{ width: "20%" }}></Input>
                    <br /><br />
                    <label>饰品唯一标识名称（见于导出报表的商品唯一标识名称列）</label>
                    <Input type="text" onChange={this.handleValueChange} name="marketHashName" style={{ width: "20%" }}></Input>
                    <br /><br />
                    <label>简易名称（标志名称和饰品一一对应但为英文不方便，此为简易名称显示于监听列表）</label>
                    <Input type="text" onChange={this.handleValueChange} name="verboseName" style={{ width: "20%" }}></Input>
                    <br /><br />
                    <label>每次抓取时间间隔（分钟）</label>
                    <Input type="number" onChange={this.handleValueChange} name="intervals" style={{ width: "20%" }}></Input>
                    <br /><br />
                    <Button type="primary" onClick={this.handleSubmit}>添加    ！</Button>
                </form>
                <br />
                <hr />
                <h3>监听饰品预估总价值：（按平均出售价计算）{totalSum.toFixed(2)}</h3>
                <br /><br />
                {subscribers && <List
                    grid={{ gutter: 16, column: 4 }}
                    dataSource={subscribers}
                    renderItem={(s) => (
                        <List.Item>
                            <Card title={s.verboseName || s.marketHashName}>
                                {(s.status === 1 || (s.status === 0 && s.lowestPrice)) ? (
                                    <div>
                                        <p><a href={`https://steamcommunity.com/market/listings/${getGameId(s.gameName)}/${encodeURI(s.marketHashName)}`} target="_blank">Steam 市场链接</a></p>
                                        <p>每次抓取间隔时间：{s.intervals}分钟</p>
                                        <p>Steam最低价：{s.lowestPrice}</p>
                                        <p>Steam平均出售价：{s.medianPrice || "无" }</p>
                                        <p>Steam平台24小时出售个数：{s.volume || "无" }</p>
                                        <p>最后更新时间：{new Date(s.updatedAt).toLocaleString()}</p>
                                    </div>
                                ) : (<p>{s.status === -1 ? "正在抓取中" : "抓取失败" }</p>)}
                                <p><Button type="danger" onClick={this.handleDeleteSubscriber.bind(null, s._id)}>删除该监听饰品</Button></p>
                            </Card>
                        </List.Item>
                    )}
                />}
            </section>
        );
    }
}

export default GoodsSubscribe;
