import React from "react";
import {TipAccount} from "../model/TipAccount";
import {UserStatus} from "../utils/Constants";
import User from "../components/User";
import {MfUserInfo, UserContext} from "../context/UserContext";

type TipWidgetProps = {
    groupName: string,
    pageId: number,
    receiver: TipAccount,
}

type TipWidgetState = {
    userInfo: MfUserInfo,
    updateUserInfo: (userInfo: MfUserInfo) => void,
}

export default class TipWidget extends React.Component<TipWidgetProps, TipWidgetState> {

    constructor(props: Readonly<TipWidgetProps> | TipWidgetProps) {
        super(props);

        this.state = {
            userInfo: {
                status: UserStatus.isChecking,
                username: undefined,
                avatar: undefined,
            },
            updateUserInfo: (userInfo: MfUserInfo) => this.setState({userInfo}),
        }
    }

    render() {
        return (
            <div>
                <UserContext.Provider value={this.state}>
                    <h1>Metaforo Tip Widget</h1>
                    <User/>
                </UserContext.Provider>
            </div>
        );
    }
}