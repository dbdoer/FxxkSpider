import * as React from "react";
import { Link } from "react-router-dom";
import { Menu, Icon, message } from "antd";
import { autobind } from "core-decorators";
import { UserContext } from "../Auth";
import { RouteChildrenProps, withRouter } from "react-router";

const SubMenu = Menu.SubMenu;

@autobind
class Nav extends React.Component<RouteChildrenProps, { current: string }> {
    public static contextType = UserContext;

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

    public componentDidMount() {
        this.checkToLogin();
    }

    public handleClick({item, key}) {
        if (this.context.userInfo.loginStatus) {
            this.setState({
                current: key,
            });
        } else {
            this.props.history.push(`/login`);
            this.setState({
                current: "login",
            });
        }
    }

    public checkToLogin() {
        const context = this.context;
        context.checkLoginStatus()
            .catch(() => {
                this.setState({
                    current: "login",
                });
            });
    }

    public render() {
        const { context } = this;
        const { userInfo } = context;
        return (
            <div>
                <Menu
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                    theme="dark"
                    onClick={this.handleClick}
                >
                    <Menu.Item key="task_list">
                        <Link to="/"><Icon type="radar-chart" />当前任务单</Link>
                    </Menu.Item>
                    <Menu.Item key="create_goods_selling_list">
                        <Link to="/create_goods_selling_list"><Icon type="plus-square" />创建新出售价格任务单</Link>
                    </Menu.Item>
                    <Menu.Item key="create_goods_buying_list">
                        <Link to="/create_goods_buying_list"><Icon type="plus-square" />创建新收购价格任务单</Link>
                    </Menu.Item>
                    <Menu.Item key="goods_subscribe">
                        <Link to="/subscribe"><Icon type="eye" />饰品订阅器</Link>
                    </Menu.Item>
                    <Menu.Item key="monitor">
                        <Link to="/monitor"><Icon type="desktop" />控制台</Link>
                    </Menu.Item>
                    {userInfo.loginStatus ?
                    <SubMenu title={<span><Icon type="user" />{userInfo.username}</span>} className="logout">
                        <Menu.Item key="logout">
                            <Link to="/logout">注销</Link>
                        </Menu.Item>
                    </SubMenu> :
                    <Menu.Item key="login" className="login">
                        <Link to="/login"><Icon type="user" />登录</Link>
                    </Menu.Item>}
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

const NavWithRouter = withRouter(Nav);

export default NavWithRouter;
