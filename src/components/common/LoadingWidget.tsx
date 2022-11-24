import {CircularProgress} from '@mui/material';
import React from 'react';

interface LoadingWidgetProp {
    loading: boolean;
}

export default function LoadingWidget(prop: LoadingWidgetProp) {
    return (
        <div
            className={'mf-dialog-circle-div'}
            style={{
                display: !prop.loading ? 'none' : 'flex',
                visibility: !prop.loading ? 'hidden' : 'visible',
                position: 'absolute',
            }}
        >
            <CircularProgress />
        </div>
    );
}
