import React, {Dispatch, useEffect} from "react";
import {TipAccount} from "../model/TipAccount";
import {
    updateUserStatusByLocalStorage,
    UserContextProvider,
    UserInfoState,
    useUserContext
} from "../context/UserContext";
import {UserStatus} from "../utils/Constants";
import {Storage} from "../utils/Storage";
import GuestView from "./GuestView";
import MemberView from "./MemberView";
import {TipWidgetContextProvider, useTipWidgetContext} from "../context/TipWidgetContext";
import {Global} from "../utils/GlobalVariables";
import log from "../utils/LogUtil";
import {SnackBarContextProvider} from "../utils/SnackBar";
import {ThemeProvider} from "@mui/material";
import {createThemeFromAttr} from "../utils/ThemeUtil";
import {composeProviders} from "../utils/Util";

// region ---- TipWidget  ----

export function TipWidgetContainer(props: any) {
    const htmlAttrs = props.props;

    if (htmlAttrs && htmlAttrs['debug']) {
        Global.isDebug = true;
        log('---- Metaforo Tipping Widget ----');
        log('Version : ' + process.env.REACT_APP_VERSION);
        log('Props : ');
        for (let i = 0; i < htmlAttrs.length; i++) {
            log(htmlAttrs[i]);
        }
        log('---- Metaforo Tipping Widget ----');
    }

    if (htmlAttrs && htmlAttrs['demo']) {
        Global.isDemo = true;
    }

    if (!htmlAttrs
        || !htmlAttrs['siteName']
        || !htmlAttrs['pageId']
        || !htmlAttrs['receiverAddress']
        || !htmlAttrs['receiverUsername']
        || !htmlAttrs['receiverChainId']
    ) {
        return null;
    }

    let paletteMode = null;
    if (htmlAttrs['theme']) {
        paletteMode = htmlAttrs['theme'].value;
    }

    const StateProviders = composeProviders(
        SnackBarContextProvider,
        TipWidgetContextProvider,
        UserContextProvider,
    );

    return (
        <ThemeProvider theme={createThemeFromAttr(paletteMode)}>
            <StateProviders>
                <TipWidget
                    siteName={htmlAttrs['siteName'].value}
                    pageId={htmlAttrs['pageId'].value}
                    receiver={{
                        address: htmlAttrs['receiverAddress'].value,
                        chainId: htmlAttrs['receiverChainId'].value,
                        username: htmlAttrs['receiverUsername'].value,
                    }}/>
            </StateProviders>
        </ThemeProvider>
    );
}

// endregion ---- TipWidget  ----
type TipWidgetProps = {
    siteName: string,
    pageId: string,
    receiver: TipAccount,
}

function TipWidget(props: TipWidgetProps) {
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
        case UserStatus.login:
            return (<MemberView/>);
        case UserStatus.notLogin:
            return (<GuestView/>);
        case UserStatus.isChecking:
        default:
            return null;
    }
}