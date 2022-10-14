import React, {useEffect, useState} from "react";
import {UserStatus} from "../utils/Constants";
import {UserContext, UserInfoContext} from "../context/UserContext";
import {Storage} from "../utils/Storage";
import WalletLogin from "./WalletLogin";

type Props = {}

type State = {
    status: number,
}

/** 包括三种状态：Checking、未登录、已登录 */
export default class User extends React.Component<Props, State> {
    constructor(props: Props, context: any) {
        super(props, context)
    }

    render() {
        return (
            <UserContext.Consumer>
                {userInfoContext => {
                    if (userInfoContext == null) {
                        return (<div></div>);
                    }
                    switch (userInfoContext.userInfo.status) {
                        case UserStatus.isChecking:
                            this.startChecking(userInfoContext);
                            return (<div>Checking Current User...</div>);
                        case UserStatus.login:
                            return (<div>Login</div>);
                        case UserStatus.notLogin:
                            return (<div>
                                <p>Not Login</p>
                                <WalletLogin/>
                            </div>);
                    }
                }}
            </UserContext.Consumer>
        );
    }

    startChecking(context: UserInfoContext) {
        if (!Storage.getItem(Storage.userToken)) {
            context.userInfo.status = UserStatus.notLogin;
            context.updateUserInfo(context.userInfo);
        } else {
            context.userInfo.status = UserStatus.login;
            context.updateUserInfo(context.userInfo);
        }
    }
}