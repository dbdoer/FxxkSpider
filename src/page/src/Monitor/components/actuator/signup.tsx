import * as React from "react";
import { autobind } from "core-decorators";
import { Card, Button, message, Input } from "antd";
import Axios from "axios";

interface ISignupState {
    username: string;
    password: string;
}

@autobind
class Signup extends React.Component<{}, ISignupState> {
    public state = {
        username: "",
        password: "",
    };

    public handleSignup() {
        Axios.post("/api/signup", this.state)
            .then((res) => {
                if (res.data.error === 0) {
                    message.success("注册成功");
                }
            })
            .catch(() => message.error("注册失败"));
    }

    public handleValueChange(ev: React.ChangeEvent<HTMLInputElement>) {
        const newState = {};
        newState[ev.target.name] = ev.target.value;
        this.setState(newState);
    }

    public render() {
        const { username, password } = this.state;
        return (
            <Card title="注册一个账号" actions={[<Button onClick={this.handleSignup}>注册</Button>]}>
                <form>
                <label>用户名：</label>
                    <Input type="text" value={username} style={{ width: "70%" }} name="username" onChange={this.handleValueChange}></Input>
                    <br /><br />
                    <label>密码：</label>
                    <Input type="password" value={password} style={{ width: "70%" }} name="password" onChange={this.handleValueChange}></Input>
                </form>
            </Card>
        );
    }
}

export default Signup;
