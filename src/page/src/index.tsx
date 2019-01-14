import * as React from "react";
import * as ReactDOM from "react-dom";
import "./main.css";
import { HashRouter, Switch, Route } from "react-router-dom";
import { TaskCreate, TaskList } from "./Tasks";
import { Nav } from "./Nav";
import { GoodsSubscribe } from "./Subscribe";
import * as serviceWorker from "./serviceWorker";

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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
