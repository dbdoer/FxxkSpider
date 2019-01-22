import * as React from "react";
import { autobind } from "core-decorators";
import { Progress, Row, Col, Divider, Card, Button, message } from "antd";
import Axios from "axios";
import { UserContext, ROLE, haveAccess, roleHOC } from "../Auth";
import ResetSteamData from "./components/actuator/resetSteamData";
import Signup from "./components/actuator/signup";

interface IMonitorDataSource {
    SteamDotA2Proportion: number;
    SteamCsgoProportion: number;
    SteamDotA2NeedCrawl: number;
    SteamCsgoNeedCrawl: number;
    SteamDotA2HasBeenCrawl: number;
    SteamCsgoHasBeenCrawl: number;
    SteamProportion: number;
    SteamAllNeedCrawl: number;
    SteamHasBeenCrawl: number;
    SteamRemaining: number;
    RemainingTime: number;
}

@autobind
class MonitorContainer extends React.Component<any, { monitorDataSource: IMonitorDataSource }> {
    public static contextType = UserContext;
    public poll: NodeJS.Timer;
    public state = {
        monitorDataSource: {
            SteamDotA2Proportion: null,
            SteamCsgoProportion: null,
            SteamDotA2NeedCrawl: null,
            SteamCsgoNeedCrawl: null,
            SteamDotA2HasBeenCrawl: null,
            SteamCsgoHasBeenCrawl: null,
            SteamProportion: null,
            SteamAllNeedCrawl: null,
            SteamHasBeenCrawl: null,
            SteamRemaining: null,
            RemainingTime: null,
        },
    };

    public componentDidMount() {
        this.fetchMonitorData()
            .then(() => {
                this.runPoll(this.fetchMonitorData);
            });
    }

    public fetchMonitorData() {
        return Axios.get("/api/monitor")
            .then((res) => {
                this.setState({
                    monitorDataSource: res.data,
                });
            })
            .catch(() => {});
    }

    public runPoll(cb) {
        this.poll = setTimeout(() => {
            if (cb) {
                cb();
            }
            this.runPoll(cb);
        }, 6000);
    }

    public componentWillUnmount() {
        clearTimeout(this.poll);
    }

    public handleUnsetSteamDataBtnClick() {
        Axios.get("/api/monitor/unset_steam_data")
            .then((res) => {
                if (res.data.error === 0) {
                    message.success("成功");
                    this.fetchMonitorData();
                } else {
                    message.error("失败");
                }
            })
            .catch(() => {});
    }

    public render() {
        const { monitorDataSource } = this.state;
        const { userInfo } = this.context;
        return (
            <section>
                <br /><br />
                <h2 className="center">监视器</h2>
                <br />
                <Row type="flex" justify="space-around">
                    <Col span={8}>
                        <Row>
                            <Col span={12}>DotA 2 steam数据抓取进度：</Col>
                            <Col span={12}><Progress percent={Number(monitorDataSource.SteamDotA2Proportion) || 0} status="active" /></Col>
                        </Row>
                    </Col>
                    <Col span={8}>
                        <Row>
                            <Col span={12}>Csgo steam数据抓取进度：</Col>
                            <Col span={12}><Progress percent={Number(monitorDataSource.SteamCsgoProportion) || 0} status="active" /></Col>
                        </Row>
                    </Col>
                </Row>
                <br /><br />
                <Row type="flex" justify="center">
                    <Col span={12}>
                        <Row>
                            <Col span={12}>总共 steam数据抓取进度：</Col>
                            <Col span={12}><Progress percent={Number(monitorDataSource.SteamProportion) || 0} status="active" /></Col>
                        </Row>
                    </Col>
                </Row>
                <br /><br />
                <Row type="flex" justify="space-around">
                    <Col span={6}>（steam）总共需要抓取饰品个数：{monitorDataSource.SteamAllNeedCrawl}</Col>
                    <Col span={6}>（steam）已抓取饰品个数：{monitorDataSource.SteamHasBeenCrawl}</Col>
                    <Col span={6}>（steam）未抓取饰品个数：{monitorDataSource.SteamRemaining}</Col>
                    <Col span={6}>（steam）预计剩余时间：{monitorDataSource.RemainingTime} 分钟</Col>
                </Row>
                <br />
                <Divider />
                <br /><br />
                {haveAccess(userInfo.role, ROLE.ADMIN, ROLE.OPERATOR) && <section>
                    <h2 className="center">执行器</h2>
                    <br />
                    <Row type="flex" justify="space-around">
                        <Col span={8}>
                            <ResetSteamData onResetSuccess={this.fetchMonitorData}/>
                        </Col>
                        {haveAccess(userInfo.role, ROLE.ADMIN) &&
                        <Col span={8}>
                            <Signup />
                        </Col>}
                    </Row>
                    <br /><br />
                </section>}
            </section>
        );
    }
}

export default roleHOC(MonitorContainer, ROLE.ADMIN, ROLE.OPERATOR);
