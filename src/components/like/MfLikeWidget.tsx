import {Global} from '../../utils/GlobalVariables';
import log from '../../utils/LogUtil';
import {composeProviders, formatSiteName} from '../../utils/Util';
import {UserContextProvider} from '../../context/UserContext';
import {createThemeFromAttr} from '../../utils/ThemeUtil';
import {ThemeProvider} from '@mui/material';
import React from 'react';
import LikeWidget from './LikeWidget';
import {LIB_VER} from '../../utils/Constants';
import {GlobalContextProvider, initGlobalState} from '../../context/GlobalContext';

export type MfLikeWidgetProps = {
    siteName: string;
    pageId: string;

    /// current user's display name.
    userDisplayName?: string;

    /// current user's avatar.
    userAvatar?: string;
    disableEditProfile?: boolean;

    theme?: string;

    /// debug mode will print log in console.
    debug?: boolean;
};

export default function MfLikeWidget(props: MfLikeWidgetProps) {
    const baseProps = initGlobalState();
    if (props.debug) {
        Global.isDebug = true;
        baseProps.isDebug = true;
        log('---- Metaforo Like Widget ----');
        log('Version : ' + LIB_VER);
        log('Props : ', props);
        log('---- Metaforo Like Widget ----');
    }

    if (!props.siteName || !props.pageId) {
        return null;
    }
    baseProps.siteName = formatSiteName(props.siteName);
    baseProps.pageId = props.pageId;
    baseProps.preferDisplayName = props.userDisplayName;
    baseProps.preferDisplayAvatar = props.userAvatar;
    if (props.disableEditProfile) {
        baseProps.disableEditProfile = true;
    }

    const StateProviders = composeProviders(UserContextProvider);
    return (
        <ThemeProvider theme={createThemeFromAttr(props.theme)}>
            <StateProviders>
                <GlobalContextProvider {...baseProps}>
                    <LikeWidget siteName={formatSiteName(props.siteName)} pageId={props.pageId} />
                </GlobalContextProvider>
            </StateProviders>
        </ThemeProvider>
    );
}
