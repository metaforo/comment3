import {CircularProgress} from "@mui/material";
import React from "react";

export default function CenterLoadingWidget(props: any) {
    const {height, width, ...restProp} = props;

    return (<div
        style={{
            height: height ?? '100%',
            width: width ?? '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...restProp,
        }}
    >
        <CircularProgress/>
    </div>);
}