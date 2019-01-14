import * as React from "react";
import { Link } from "react-router-dom";
import { Menu, Icon } from "antd";
import { autobind } from "core-decorators";
import * as H from "history";

@autobind
class Nav extends React.Component<any, { current: string }> {
    constructor(args) {
        super(args);
        switch (this.props.location.pathname) {
            case "/create_goods_selling_list":
                this.state = {
                    current: "create_goods_selling_list",
                };
                break;
            case "/create_goods_buying_list":
                this.state = {
                    current: "create_goods_buying_list",
                };
                break;
            case "/subscribe":
                this.state = {
                    current: "goods_subscribe",
                };
                break;
            case "/monitor":
                this.state = {
                    current: "monitor",
                };
                break;
            case "/":
            default:
                this.state = {
                    current: "task_list",
                };
                break;
        }
    }

    public handleClick(e) {
        this.setState({
            current: e.key,
        });
    }

    public render() {
        return (
            <div>
                <Menu
                    onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                    theme="dark"
                >
                    <Menu.Item key="task_list">
                        <Link to="/"><Icon type="appstore" />当前任务单</Link>
                    </Menu.Item>
                    <Menu.Item key="create_goods_selling_list">
                        <Link to="/create_goods_selling_list"><Icon type="appstore" />创建新出售价格任务单</Link>
                    </Menu.Item>
                    <Menu.Item key="create_goods_buying_list">
                        <Link to="/create_goods_buying_list"><Icon type="appstore" />创建新收购价格任务单</Link>
                    </Menu.Item>
                    <Menu.Item key="goods_subscribe">
                        <Link to="/subscribe"><Icon type="appstore" />饰品订阅器</Link>
                    </Menu.Item>
                    <Menu.Item key="monitor">
                        <Link to="/monitor"><Icon type="appstore" />控制台</Link>
                    </Menu.Item>
                </Menu>
                {/* <nav style={{ textAlign: "center", width: "100vw", margin: "0 0 50px 0" }}>
                    <Link to="/" style={{ margin: "0 30px " }}>当前任务单</Link>
                    <Link to="/create" style={{ margin: "0 30px " }}>创建新任务单</Link>
                    <Link to="/subscribe" style={{ margin: "0 30px " }}>饰品监听</Link>
                </nav> */}
            {this.props.children}
            </div>
        );
    }
}

export default Nav;
