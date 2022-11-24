import React, {Dispatch, useEffect, useState} from 'react';
import {TipAccount} from '../../model/TipAccount';
import {updateUserStatusByLocalStorage, UserInfoState, useUserContext} from '../../context/UserContext';
import {UserStatus} from '../../utils/Constants';
import {Storage} from '../../utils/Storage';
import {useTipWidgetContext} from '../../context/TipWidgetContext';
import {EverpayDialog} from './EverpayTipDialog';
import {LoginDialog} from '../login/LoginDialog';

type TipWidgetProps = {
    siteName: string;
    pageId: string;
    receiver: TipAccount;
};

export default function TippingWidget(props: TipWidgetProps) {
    const {userInfoState, setUserState} = useUserContext();
    const {tipWidgetDispatch} = useTipWidgetContext();
    const [isOpenLoginDialog, setIsOpenLoginDialog] = useState(false);
    const [isOpenTippingDialog, setIsOpenTippingDialog] = useState(false);

    useEffect(() => {
        tipWidgetDispatch(props);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        switch (userInfoState.loginStatus) {
            case UserStatus.login:
                setIsOpenLoginDialog(false);
                setIsOpenTippingDialog(true);
                break;
            case UserStatus.notLogin:
                setIsOpenLoginDialog(true);
                setIsOpenTippingDialog(false);
                break;
            case UserStatus.isChecking:
            default:
                setIsOpenLoginDialog(false);
                setIsOpenTippingDialog(false);
                startChecking(userInfoState, setUserState);
                break;
        }
        // eslint-disable-next-line
    }, [userInfoState]);

    function startChecking(userInfoState: UserInfoState, dispatch: Dispatch<UserInfoState>) {
        if (!Storage.getItem(Storage.userToken)) {
            userInfoState.loginStatus = UserStatus.notLogin;
            dispatch(userInfoState);
        } else {
            userInfoState.loginStatus = UserStatus.login;
            updateUserStatusByLocalStorage(userInfoState, dispatch);
        }
    }

    return (
        <>
            <EverpayDialog open={isOpenTippingDialog} closeDialog={() => setIsOpenTippingDialog(false)} />
            <LoginDialog open={isOpenLoginDialog} closeDialog={() => setIsOpenLoginDialog(false)} />
        </>
    );
}
