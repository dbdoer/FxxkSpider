import * as React from "react";
import { UserContext } from "./userContext";

const AuthConsumer = UserContext.Consumer;

export const ROLE = {
    ADMIN: 1,
    OPERATOR: 2,
    USER: 3,
};

export const haveAccess = (role: number[], ...needRole: number[]) => {
    return needRole.some((r) => role.includes(r));
};

export const roleHOC = (CMP: React.ComponentClass, ...needRole) => class Component extends React.Component<any> {
    public static contextType = UserContext;

    constructor(props) {
        super(props);
    }

    public render() {
        return (
            <AuthConsumer>
                {(ctx) => haveAccess(ctx.userInfo.role, ...needRole) ? <CMP {...this.props} /> : "无权限"}
            </AuthConsumer>
        );
    }
};
