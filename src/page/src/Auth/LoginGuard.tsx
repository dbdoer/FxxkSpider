import * as React from "react";
import { autobind } from "core-decorators";
import { userInfo, UserContext } from "./userContext";
import Axios from "axios";
import { withRouter, RouteChildrenProps } from "react-router";
import { message } from "antd";

const AuthProvider = UserContext.Provider;

interface ILoginGuardState {
    userInfo: {
        loginStatus: boolean;
        username: string;
        role: number[];
    };
    setLoginStatus: (status: boolean) => void;
    setUsername: (username: string) => void;
    checkLoginStatus: () => void;
}

@autobind
class LoginGuard extends React.Component<RouteChildrenProps, ILoginGuardState> {
    public state = {
        userInfo,
        setLoginStatus: this.setLoginStatus,
        setUsername: this.setUsername,
        checkLoginStatus: this.checkLoginStatus,
    };

    public componentDidMount() {
        this.checkLoginStatus();
    }

    public checkLoginStatus() {
        const pathname = this.props.location.pathname;
        Axios.get("/api/user")
            .then((res) => {
                this.state.setLoginStatus(true);
                this.state.setUsername(res.data.username);
            })
            .catch(() => {
                if (pathname !== "/login" && pathname !== "/logout") {
                    this.props.history.push(`/login`);
                }
            });
    }

    public setLoginStatus(status: boolean) {
        this.setState((preState) => {
            preState.userInfo.loginStatus = status;
            return preState;
        });
    }

    public setUsername(username: string) {
        this.setState((preState) => {
            preState.userInfo.username = username;
            return preState;
        });
    }

    public render() {
        return (
            <AuthProvider value={this.state}>
                {this.props.children}
            </AuthProvider>
        );
    }
}

const LoginGuardWithRouter = withRouter(LoginGuard);

export default LoginGuardWithRouter;
