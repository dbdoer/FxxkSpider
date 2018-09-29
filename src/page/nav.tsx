import * as React from "react";
import { Link } from "react-router-dom";

class Nav extends React.Component {
    public render() {
        return (
            <div>
                <nav style={{ textAlign: "center", width: "100vw", margin: "0 0 50px 0" }}>
                    <Link to="/" style={{ margin: "0 30px " }}>当前任务单</Link>
                    <Link to="/create" style={{ margin: "0 30px " }}>创建新任务单</Link>
                </nav>
            {this.props.children}
            </div>
        );
    }
}

export default Nav;
