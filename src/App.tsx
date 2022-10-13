import React from 'react';
import TipWidget from "./screens/TipWidget";
import {ThemeProvider} from "@mui/material";
import {theme} from "./utils/ThemeUtil";
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
        return (<p>Missing attributes!</p>);
    }

    return (
        <ThemeProvider theme={theme}>
            <SnackBarContextProvider>
                <TipWidgetContextProvider>
                    <UserContextProvider>
                        <TipWidget siteName={htmlAttrs['siteName']} pageId={htmlAttrs['pageId']}
                                   receiver={{
                                       address: htmlAttrs['receiverAddress'],
                                       chainId: htmlAttrs['receiverChainId'],
                                       username: htmlAttrs['receiverUsername'],
                                   }}/>
                    </UserContextProvider>
                </TipWidgetContextProvider>
            </SnackBarContextProvider>
        </ThemeProvider>
    );
}

export default App;
