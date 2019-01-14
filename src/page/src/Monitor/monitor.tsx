import * as React from "react";
import { autobind } from "core-decorators";
import { Progress, Row, Col } from "antd";

@autobind
class MonitorContainer extends React.Component {
    public render() {
        return (
            <section>
                <br /><br />
                <h2 className="center">监视器</h2>
                <br />
                <Row type="flex" justify="space-around">
                    <Col span={8}>
                        <Row>
                            <Col span={12}>DotA 2 steam数据抓取进度：</Col>
                            <Col span={12}><Progress percent={50} status="active" /></Col>
                        </Row>
                    </Col>
                    <Col span={8}>
                        <Row>
                            <Col span={12}>DotA 2 steam数据抓取进度：</Col>
                            <Col span={12}><Progress percent={50} status="active" /></Col>
                        </Row>
                    </Col>
                </Row>
                <br /><br />
                <Row type="flex" justify="center">
                    <Col span={12}>
                        <Row>
                            <Col span={12}>总共 steam数据抓取进度：</Col>
                            <Col span={12}><Progress percent={50} status="active" /></Col>
                        </Row>
                    </Col>
                </Row>
            </section>
        );
    }
}

export default MonitorContainer;
