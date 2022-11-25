import React from 'react';
import ReactDOM from 'react-dom/client';
// import {MfCommentWidget, MfTippingWidget} from '../../src';
import {MfCommentWidget, MfTippingWidget} from '@dforo3/metaforo-sdk/dist/esm';

// region ---- Tipping ----

const tippingWidgets = document.getElementsByClassName('metaforo-tip');
if (tippingWidgets) {
    for (let i = 0; i < tippingWidgets.length; i++) {
        const e = tippingWidgets.item(i);
        if (!(e && e instanceof HTMLElement)) {
            continue;
        }
        e.addEventListener('click', (event) => {
            if (event.target && event.target instanceof HTMLElement) {
                showTipDialog(event.target);
            }
        });
    }
}

function showTipDialog(element: HTMLElement) {
    let div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    root.render(
        <MfTippingWidget
            siteName={'CommentWidgetDemo'}
            pageId={'DemoThread1'}
            receiverAddress={'0x9d7bA953587B87c474a10beb65809Ea489F026bD'}
            receiverChainId={1}
            receiverUsername={'liuwei6v.eth'}
            // theme={'dark'}
        />,
    );
}

// endregion ---- Tipping ----

// region ---- Comment ----

const commentWidgets = document.getElementsByClassName('metaforo-comment');
if (commentWidgets) {
    for (let i = 0; i < commentWidgets.length; i++) {
        const e = commentWidgets.item(i);
        if (!(e && e instanceof HTMLElement)) {
            continue;
        }
        showComment(e);
    }
}

function showComment(e: HTMLElement) {
    // // @ts-ignore
    // window.mfTheme = {
    //     palette: {
    //         background: {
    //             paper: '#232323',
    //         }
    //     }
    // }

    const root = ReactDOM.createRoot(e);
    root.render(
        <MfCommentWidget
            siteName={'CommentWidgetDemo'}
            pageId={'DemoThread1'}
            // theme={'dark'}
        />,
    );
}

// endregion ---- Comment ----
