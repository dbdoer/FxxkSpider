import * as React from "react";
import * as ReactDOM from "react-dom";
import "./main.css";
import { HashRouter, Switch, Route, BrowserRouter } from "react-router-dom";
import { TaskCreate, TaskList } from "./Tasks";
import { Nav } from "./Nav";
import { GoodsSubscribe } from "./Subscribe";
import { MonitorContainer } from "./Monitor";
import * as serviceWorker from "./serviceWorker";
import { LoginContainer, LoginGuard, LogoutContainer } from "./Auth";

ReactDOM.render(
    <BrowserRouter>
        <LoginGuard>
            <Switch>
                <Nav>
                    <Route path="/" exact={true}  component={TaskList} />
                    <Route path="/create_goods_selling_list" component={() => <TaskCreate type="selling"/>} />
                    <Route path="/create_goods_buying_list" component={() => <TaskCreate type="buying"/>} />
                    <Route path="/subscribe" component={GoodsSubscribe} />
                    <Route path="/monitor" component={MonitorContainer} />
                    <Route path="/login" component={LoginContainer} />
                    <Route path="/logout" component={LogoutContainer} />
                </Nav>
            </Switch>
        </LoginGuard>
    </BrowserRouter>,
    document.getElementById("root") as HTMLElement,
    () => console.log("Page 服务已启动"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
