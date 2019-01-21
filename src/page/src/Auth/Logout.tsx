import * as React from "react";
import Axios from "axios";
import { UserContext } from "./userContext";

class LogoutContainer extends React.Component {
    public static contextType = UserContext;

    public componentDidMount() {
        if (this.context.userInfo.loginStatus) {
            Axios.post("/api/logout")
                .then(() => location.href = "/login");
        } else {
            location.href = "/login";
        }
    }

    public render() {
        return "";
    }
}

export default LogoutContainer;
