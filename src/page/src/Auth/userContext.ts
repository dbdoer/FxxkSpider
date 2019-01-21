import * as React from "react";

const userInfo = {
    loginStatus: false,
    username: "",
    role: [],
};

const UserContext = React.createContext({
    userInfo,
    setLoginStatus: (props) => {},
    setUsername: (props) => {},
    checkLoginStatus: () => {},
});

export {
    UserContext,
    userInfo,
};
