import React from 'react';
import TipWidget from "./screens/TipWidget";
import {ThemeProvider} from "@mui/material";
import {createThemeFromAttr} from "./utils/ThemeUtil";
import {SnackBarContextProvider} from "./utils/SnackBar";
import {UserContextProvider} from "./context/UserContext";
import {TipWidgetContextProvider} from "./context/TipWidgetContext";
import {Global} from "./utils/GlobalVariables";
import log from "./utils/LogUtil";

function App(props: any) {
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

function composeProviders(...providers: any) {
    return ({children}: { children: JSX.Element }) => providers.reduce(
        (prev: any, Provider: any) => <Provider>{prev}</Provider>,
        children,
    );
}

export default App;
