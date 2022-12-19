import {Global} from '../../utils/GlobalVariables';
import log from '../../utils/LogUtil';
import {composeProviders, formatSiteName} from '../../utils/Util';
import {UserContextProvider} from '../../context/UserContext';
import {createThemeFromAttr} from '../../utils/ThemeUtil';
import {ThemeProvider} from '@mui/material';
import React from 'react';
import LikeWidget from './LikeWidget';
import {LIB_VER} from '../../utils/Constants';

export type MfLikeWidgetProps = {
    siteName: string;
    pageId: string;

    /// current user's display name.
    userDisplayName?: string;

    /// current user's avatar.
    userAvatar?: string;

    theme?: string;

    /// debug mode will print log in console.
    debug?: boolean;
}

export default function MfLikeWidget(props: MfLikeWidgetProps) {
    if (props.debug) {
        Global.isDebug = true;
        log('---- Metaforo Like Widget ----');
        log('Version : ' + LIB_VER);
        log('Props : ', props);
        log('---- Metaforo Like Widget ----');
    }

    if (!props.siteName || !props.pageId) {
        return null;
    }

    const StateProviders = composeProviders(UserContextProvider);
    return (
        <ThemeProvider theme={createThemeFromAttr(props.theme)}>
            <StateProviders>
                <LikeWidget
                    siteName={formatSiteName(props.siteName)}
                    pageId={props.pageId}
                />
            </StateProviders>
        </ThemeProvider>
    );
}