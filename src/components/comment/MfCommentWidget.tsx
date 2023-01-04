import log from '../../utils/LogUtil';
import {composeProviders, formatSiteName} from '../../utils/Util';
import {SnackBarContextProvider} from '../../utils/SnackBar';
import {CommentWidgetContextProvider} from '../../context/CommentWidgetContext';
import {UserContextProvider} from '../../context/UserContext';
import {ThemeProvider} from '@mui/material';
import {createThemeFromAttr} from '../../utils/ThemeUtil';
import React, {memo} from 'react';
import CommentWidget from './CommentWidget';
import {initQuill} from '../../utils/QuillUtil';
import '../../css/quill.css';
import {LIB_VER} from '../../utils/Constants';
import {GlobalContextProvider, initGlobalState} from '../../context/GlobalContext';
import {Global} from '../../utils/GlobalVariables';

export type MfCommentWidgetProps = {
    siteName: string;
    pageId: string;
    /// default is 1. use decimal. For example: if you want 0x89 (polygon), you need set chainId as 137.
    chainId?: number;

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

// use memo to avoid re-render when parent widget is re-rendering. ref : https://www.zhihu.com/question/442368205
const MfCommentWidget: React.FC<MfCommentWidgetProps> = memo((props: MfCommentWidgetProps) => (
    <MfCommentWidgetContainer {...props} />
));

MfCommentWidget.displayName = 'MfCommentWidget';
export default MfCommentWidget;

function MfCommentWidgetContainer(props: MfCommentWidgetProps) {
    const baseProps = initGlobalState();
    if (props.debug) {
        Global.isDebug = true;
        baseProps.isDebug = true;
        log('---- Metaforo Comment Widget ----');
        log('Version : ' + LIB_VER);
        log('Props : ', props);
        log('---- Metaforo Comment Widget ----');
    }

    if (props.demo) {
        baseProps.isDemo = true;
    }

    if (!props.siteName || !props.pageId) {
        return null;
    }
    baseProps.siteName = formatSiteName(props.siteName);
    baseProps.pageId = props.pageId;
    baseProps.preferDisplayName = props.userDisplayName;
    baseProps.preferDisplayAvatar = props.userAvatar;
    baseProps.chainId = props.chainId;
    if (props.disableEditProfile) {
        baseProps.disableEditProfile = true;
    }

    initQuill();
    const StateProviders = composeProviders(SnackBarContextProvider, CommentWidgetContextProvider, UserContextProvider);
    return (
        <ThemeProvider theme={createThemeFromAttr(props.theme)}>
            <StateProviders>
                <GlobalContextProvider {...baseProps}>
                    <CommentWidget
                        siteName={formatSiteName(props.siteName)}
                        pageId={props.pageId}
                        variant={props.variant ?? 'card'}
                    />
                </GlobalContextProvider>
            </StateProviders>
        </ThemeProvider>
    );
}
