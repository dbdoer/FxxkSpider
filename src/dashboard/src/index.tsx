import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter, Switch, Route } from "react-router-dom";
import TaskCreate from "./create";
import TaskList from "./list";
import Nav from "./nav";
import GoodsSubscribe from "./subscribe";

ReactDOM.render(
    <HashRouter>
        <Switch>
            <Nav>
                <Route path="/" exact={true}  component={TaskList} />
                <Route path="/create" component={TaskCreate} />
                <Route path="/subscribe" component={GoodsSubscribe} />
            </Nav>
        </Switch>
    </HashRouter>,
    document.getElementById("root") as HTMLElement,
    () => console.log("Page 服务已启动"),
);
