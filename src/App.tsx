import React from 'react';
import TipWidget from "./screens/TipWidget";
import {ThemeProvider} from "@mui/material";
import {createThemeFromAttr} from "./utils/ThemeUtil";
import {SnackBarContextProvider} from "./utils/SnackBar";
import {UserContextProvider} from "./context/UserContext";
import {TipWidgetContextProvider} from "./context/TipWidgetContext";

function App(props: any) {
    const htmlAttrs = props.props;
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

    return (
        <ThemeProvider theme={createThemeFromAttr(paletteMode)}>
            <SnackBarContextProvider>
                <TipWidgetContextProvider>
                    <UserContextProvider>
                        <TipWidget
                            siteName={htmlAttrs['siteName'].value}
                            pageId={htmlAttrs['pageId'].value}
                            receiver={{
                                address: htmlAttrs['receiverAddress'].value,
                                chainId: htmlAttrs['receiverChainId'].value,
                                username: htmlAttrs['receiverUsername'].value,
                            }}/>
                    </UserContextProvider>
                </TipWidgetContextProvider>
            </SnackBarContextProvider>
        </ThemeProvider>
    );
}

export default App;
