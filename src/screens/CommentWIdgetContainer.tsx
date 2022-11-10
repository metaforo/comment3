import {Global} from "../utils/GlobalVariables";
import log from "../utils/LogUtil";
import {composeProviders} from "../utils/Util";
import {SnackBarContextProvider} from "../utils/SnackBar";
import {CommentWidgetContextProvider} from "../context/CommentWidgetContext";
import {UserContextProvider} from "../context/UserContext";
import {ThemeProvider} from "@mui/material";
import {createThemeFromAttr} from "../utils/ThemeUtil";
import React from "react";
import CommentWidget from "./CommentWidget";

export function CommentWidgetContainer(props: any) {
    const htmlAttrs = props.props;

    if (htmlAttrs && htmlAttrs['debug']) {
        Global.isDebug = true;
        log('---- Metaforo Comment Widget ----');
        log('Version : ' + process.env.REACT_APP_VERSION);
        log('Props : ');
        for (let i = 0; i < htmlAttrs.length; i++) {
            log(htmlAttrs[i]);
        }
        log('---- Metaforo Comment Widget ----');
    }

    if (htmlAttrs && htmlAttrs['demo']) {
        Global.isDemo = true;
    }

    if (!htmlAttrs
        || !htmlAttrs['siteName']
        || !htmlAttrs['pageId']
    ) {
        return null;
    }

    let paletteMode = null;
    if (htmlAttrs['theme']) {
        paletteMode = htmlAttrs['theme'].value;
    }

    const StateProviders = composeProviders(
        SnackBarContextProvider,
        CommentWidgetContextProvider,
        UserContextProvider,
    );

    return (
        <ThemeProvider theme={createThemeFromAttr(paletteMode)}>
            <StateProviders>
                <CommentWidget
                    siteName={htmlAttrs['siteName'].value}
                    pageId={htmlAttrs['pageId'].value}
                    variant={htmlAttrs['variant']?.value ?? 'card'}
                />
            </StateProviders>
        </ThemeProvider>
    );
}