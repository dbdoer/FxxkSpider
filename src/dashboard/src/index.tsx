import * as React from "react";
import * as ReactDOM from "react-dom";
import "./App.css";
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
                <Route path="/create_goods_selling_list" component={() => <TaskCreate type="selling"/>} />
                <Route path="/create_goods_buying_list" component={() => <TaskCreate type="buying"/>} />
                <Route path="/subscribe" component={GoodsSubscribe} />
            </Nav>
        </Switch>
    </HashRouter>,
    document.getElementById("root") as HTMLElement,
    () => console.log("Page 服务已启动"),
);
