import React, {Dispatch, useEffect} from "react";
import {TipAccount} from "../model/TipAccount";
import {updateUserStatusByLocalStorage, UserInfoState, useUserContext} from "../context/UserContext";
import {UserStatus} from "../utils/Constants";
import {Storage} from "../utils/Storage";
import GuestView from "./GuestView";
import MemberView from "./MemberView";
import {useTipWidgetContext} from "../context/TipWidgetContext";

type TipWidgetProps = {
    siteName: string,
    pageId: string,
    receiver: TipAccount,
}

export default function TipWidget(props: TipWidgetProps) {
    const {userInfoState, setUserState} = useUserContext();
    const {tipWidgetDispatch} = useTipWidgetContext();

    useEffect(() => {
        tipWidgetDispatch(props);

        if (userInfoState.loginStatus === UserStatus.isChecking) {
            startChecking(userInfoState, setUserState);
        }
        // eslint-disable-next-line
    }, []);

    function startChecking(userInfoState: UserInfoState, dispatch: Dispatch<UserInfoState>) {
        if (!Storage.getItem(Storage.userToken)) {
            userInfoState.loginStatus = UserStatus.notLogin;
            dispatch(userInfoState);
        } else {
            userInfoState.loginStatus = UserStatus.login;
            updateUserStatusByLocalStorage(userInfoState, dispatch);
        }
    }


    switch (userInfoState.loginStatus) {
        case UserStatus.isChecking:
            return (<div>Checking Current User...</div>);
        case UserStatus.login:
            return (<MemberView/>);
        case UserStatus.notLogin:
            return (<GuestView/>);
        default:
            return <div></div>
    }
}