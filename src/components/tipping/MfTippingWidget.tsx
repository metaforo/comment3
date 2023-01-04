import {Global} from '../../utils/GlobalVariables';
import log from '../../utils/LogUtil';
import {composeProviders, formatSiteName} from '../../utils/Util';
import {SnackBarContextProvider} from '../../utils/SnackBar';
import {TipWidgetContextProvider} from '../../context/TipWidgetContext';
import {UserContextProvider} from '../../context/UserContext';
import {ThemeProvider} from '@mui/material';
import {createThemeFromAttr} from '../../utils/ThemeUtil';
import React, {memo} from 'react';
import TippingWidget from './TippingWidget';
import {LIB_VER} from '../../utils/Constants';
import {GlobalContextProvider, initGlobalState} from '../../context/GlobalContext';

export type MfTippingWidgetProps = {
    siteName: string;
    pageId: string;

    receiverAddress: string;
    receiverChainId: number;
    receiverUsername: string;

    /// light or dark. default is light.
    theme?: string;

    /// debug mode will print log in console.
    debug?: boolean;

    /// demo mode allows users tipping 0 to the target user ( It can not be 0 when demo mode is false)
    demo?: boolean;
};

// use memo to avoid re-render when parent widget is re-rendering. ref : https://www.zhihu.com/question/442368205
const MfTippingWidget: React.FC<MfTippingWidgetProps> = memo((props: MfTippingWidgetProps) => (
    <MfTippingWidgetContainer {...props} />
));

MfTippingWidget.displayName = 'MfTippingWidget';
export default MfTippingWidget;

function MfTippingWidgetContainer(props: MfTippingWidgetProps) {
    const baseProps = initGlobalState();

    if (props.debug) {
        Global.isDebug = true;
        baseProps.isDebug = true;
        log('---- Metaforo Tipping Widget ----');
        log('Version : ' + LIB_VER);
        log('Props : ', props);
        log('---- Metaforo Tipping Widget ----');
    }
    baseProps.isDemo = props.demo ?? false;

    if (
        !props.siteName ||
        !props.pageId ||
        !props.receiverChainId ||
        !props.receiverAddress ||
        !props.receiverUsername
    ) {
        return null;
    }
    baseProps.siteName = formatSiteName(props.siteName);
    baseProps.pageId = props.pageId;
    // baseProps.preferDisplayName = props.userDisplayName;
    // baseProps.preferDisplayAvatar = props.userAvatar;
    // if (props.disableEditProfile) {
    //     baseProps.disableEditProfile = true;
    // }

    const StateProviders = composeProviders(SnackBarContextProvider, TipWidgetContextProvider, UserContextProvider);
    return (
        <ThemeProvider theme={createThemeFromAttr(props.theme)}>
            <StateProviders>
                <GlobalContextProvider {...baseProps}>
                    <TippingWidget
                        siteName={formatSiteName(props.siteName)}
                        pageId={props.pageId}
                        receiver={{
                            address: props.receiverAddress,
                            chainId: props.receiverChainId,
                            username: props.receiverUsername,
                        }}
                    />
                </GlobalContextProvider>
            </StateProviders>
        </ThemeProvider>
    );
}
