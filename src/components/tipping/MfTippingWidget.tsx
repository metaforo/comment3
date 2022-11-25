import {Global} from '../../utils/GlobalVariables';
import log from '../../utils/LogUtil';
import {composeProviders, formatSiteName} from '../../utils/Util';
import {SnackBarContextProvider} from '../../utils/SnackBar';
import {TipWidgetContextProvider} from '../../context/TipWidgetContext';
import {UserContextProvider} from '../../context/UserContext';
import {ThemeProvider} from '@mui/material';
import {createThemeFromAttr} from '../../utils/ThemeUtil';
import React from 'react';
import TippingWidget from './TippingWidget';

type MfTippingWidgetProps = {
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

export default function MfTippingWidget(props: MfTippingWidgetProps) {
    Global.isDebug = props.debug ?? false;
    Global.isDemo = props.demo ?? false;

    if (props.debug) {
        log('---- Metaforo Tipping Widget ----');
        log('Version : ' + process.env.REACT_APP_VERSION);
        log('Props : ', props);
        log('---- Metaforo Tipping Widget ----');
    }

    if (
        !props.siteName ||
        !props.pageId ||
        !props.receiverChainId ||
        !props.receiverAddress ||
        !props.receiverUsername
    ) {
        return null;
    }

    const StateProviders = composeProviders(SnackBarContextProvider, TipWidgetContextProvider, UserContextProvider);
    return (
        <ThemeProvider theme={createThemeFromAttr(props.theme)}>
            <StateProviders>
                <TippingWidget
                    siteName={formatSiteName(props.siteName)}
                    pageId={props.pageId}
                    receiver={{
                        address: props.receiverAddress,
                        chainId: props.receiverChainId,
                        username: props.receiverUsername,
                    }}
                />
            </StateProviders>
        </ThemeProvider>
    );
}
