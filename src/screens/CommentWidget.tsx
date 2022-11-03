import {Global} from "../utils/GlobalVariables";
import log from "../utils/LogUtil";
import {SnackBarContextProvider} from "../utils/SnackBar";
import {
    updateUserStatusByLocalStorage,
    UserContextProvider,
    UserInfoState,
    useUserContext
} from "../context/UserContext";
import {composeProviders} from "../utils/Util";
import {CommentWidgetContextProvider, useCommentWidgetContext} from "../context/CommentWidgetContext";
import {ThemeProvider} from "@mui/material";
import {createThemeFromAttr} from "../utils/ThemeUtil";
import React, {Dispatch, useEffect} from "react";
import {UserStatus} from "../utils/Constants";
import {Storage} from "../utils/Storage";
import CommentList from "../components/comment/CommentList";
import CreateCommentWidget from "../components/comment/CreateCommentWidget";

export function CommentWidgetContainer(props: any) {
    const htmlAttrs = props.props;

    if (htmlAttrs && htmlAttrs['debug']) {
        Global.isDebug = true;
        log('---- Metaforo Comment Widget ----');
        log('Version : ' + process.env.REACT_APP_VERSION);
        log('Props : ');
        for (let i = 0; i < htmlAttrs.length; i++) {
            log(htmlAttrs[i]);
        }
        log('---- Metaforo Comment Widget ----');
    }

    if (htmlAttrs && htmlAttrs['demo']) {
        Global.isDemo = true;
    }

    if (!htmlAttrs
        || !htmlAttrs['siteName']
        || !htmlAttrs['pageId']
    ) {
        return null;
    }

    let paletteMode = null;
    if (htmlAttrs['theme']) {
        paletteMode = htmlAttrs['theme'].value;
    }

    const StateProviders = composeProviders(
        SnackBarContextProvider,
        CommentWidgetContextProvider,
        UserContextProvider,
    );

    return (
        <ThemeProvider theme={createThemeFromAttr(paletteMode)}>
            <StateProviders>
                <CommentWidget
                    siteName={htmlAttrs['siteName'].value}
                    pageId={htmlAttrs['pageId'].value}
                />
            </StateProviders>
        </ThemeProvider>
    );
}

type CommentWidgetProps = {
    siteName: string,
    pageId: string,
    needRefresh?: boolean,
}

function CommentWidget(props: CommentWidgetProps) {
    const {userInfoState, setUserState} = useUserContext();
    const {commentWidgetDispatch} = useCommentWidgetContext();

    useEffect(() => {
        commentWidgetDispatch(props);

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

    // @ts-ignore
    const link = `${process.env.REACT_APP_API_HOST.replace('/api', '/')}g/${props.siteName}/thread/${props.pageId}`;
    return (
        <>
            <CreateCommentWidget/>
            <a href={link}>Open Origin Thread</a>
            <CommentList/>
        </>
    );
}