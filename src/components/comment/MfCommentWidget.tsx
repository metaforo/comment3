import {Global} from '../../utils/GlobalVariables';
import log from '../../utils/LogUtil';
import {composeProviders, formatSiteName} from '../../utils/Util';
import {SnackBarContextProvider} from '../../utils/SnackBar';
import {CommentWidgetContextProvider} from '../../context/CommentWidgetContext';
import {UserContextProvider} from '../../context/UserContext';
import {ThemeProvider} from '@mui/material';
import {createThemeFromAttr} from '../../utils/ThemeUtil';
import React from 'react';
import CommentWidget from './CommentWidget';
import {initQuill} from '../../utils/QuillUtil';
import '../../css/quill.css';
import {LIB_VER} from '../../utils/Constants';

export type MfCommentWidgetProps = {
    siteName: string;
    pageId: string;

    /// current user's display name.
    userDisplayName?: string;

    /// current user's avatar.
    userAvatar?: string;

    /// if true, users can not edit their profile by metaforo sdk. (but they still can edit profile in metaforo)
    disableEditProfile?: boolean;

    /// light or dark. default is light.
    theme?: string;

    /// card or plain. default is card.
    variant?: string;

    /// debug mode will print log in console.
    debug?: boolean;

    /// demo mode allows users tipping 0 to the target user ( It can not be 0 when demo mode is false)
    demo?: boolean;
};

export default function MfCommentWidget(props: MfCommentWidgetProps) {
    if (props.debug) {
        Global.isDebug = true;
        log('---- Metaforo Comment Widget ----');
        log('Version : ' + LIB_VER);
        log('Props : ', props);
        log('---- Metaforo Comment Widget ----');
    }

    if (props.demo) {
        Global.isDemo = true;
    }

    if (!props.siteName || !props.pageId) {
        return null;
    }
    Global.siteName = formatSiteName(props.siteName);
    Global.preferDisplayName = props.userDisplayName;
    Global.preferDisplayAvatar = props.userAvatar;
    if (props.disableEditProfile) {
        Global.disableEditProfile = true;
    }

    initQuill();

    const StateProviders = composeProviders(SnackBarContextProvider, CommentWidgetContextProvider, UserContextProvider);
    return (
        <ThemeProvider theme={createThemeFromAttr(props.theme)}>
            <StateProviders>
                <CommentWidget
                    siteName={formatSiteName(props.siteName)}
                    pageId={props.pageId}
                    variant={props.variant ?? 'card'}
                />
            </StateProviders>
        </ThemeProvider>
    );
}
