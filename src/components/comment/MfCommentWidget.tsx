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
import '../../css/quill.scss';
import '../../utils/GlobalImport';
import '../../css/common.scss';
import {initQuill} from '../../utils/QuillUtil';

type MfCommentWidgetProps = {
    siteName: string;
    pageId: string;

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
        log('Version : ' + process.env.REACT_APP_VERSION);
        log('Props : ', props);
        log('---- Metaforo Comment Widget ----');
    }

    if (props.demo) {
        Global.isDemo = true;
    }

    if (!props.siteName || !props.pageId) {
        return null;
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
