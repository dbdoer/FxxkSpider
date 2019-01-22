import * as React from "react";
import { autobind } from "core-decorators";
import { Input, Button, message } from "antd";
import Axios from "axios";
import { UserContext } from "./userContext";
import { RouteChildrenProps } from "react-router";

interface ILoginContainerState {
    loginForm: {
        username: string;
        password: string;
    };
}

@autobind
class LoginContainer extends React.Component<RouteChildrenProps, ILoginContainerState> {
    public static contextType = UserContext;

    public state = {
        loginForm: {
            username: "",
            password: "",
        },
    };

    public componentWillReceiveProps() {
        if (!this.context.userInfo.loginStatus) {
            message.error("未登录，请先登录");
        }
    }

    public handleValueChange(ev: React.ChangeEvent<HTMLInputElement>) {
        ev.persist();
        this.setState((preState) => {
            preState.loginForm[ev.target.name] = ev.target.value;
            return preState;
        });
    }

    public handleSubmit() {
        const { loginForm } = this.state;
        Axios.post("/api/login", { username: loginForm.username, password: loginForm.password })
            .then((res) => {
                if (res.data.error === 0) {
                    this.context.checkLoginStatus();
                    message.success("登录成功");
                    this.props.history.push("/");
                }
            })
            .catch(() => message.error("登录失败"));
    }

    public render() {
        const { loginForm } = this.state;
        const { userInfo } = this.context;
        return (
            userInfo.loginStatus ?
                <section className="center-section">
                    <br /><br />
                    <h2>您已作为 {userInfo.username} 登录，切换账户请先注销</h2>
                </section> :
                <section className="center-section">
                <br /><br />
                <h2>登录以享用所有服务</h2>
                <form>
                    <label>用户名：</label>
                    <Input type="text" value={loginForm.username} style={{ width: "20%" }} name="username" onChange={this.handleValueChange}></Input>
                    <br /><br />
                    <label>密码：</label>
                    <Input type="password" value={loginForm.password} style={{ width: "20%" }} name="password" onChange={this.handleValueChange}></Input>
                    <br /><br />
                    <Button type="primary" onClick={this.handleSubmit}>登录</Button>
                </form>
            </section>
        );
    }
}

export default LoginContainer;
