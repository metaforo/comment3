import React from 'react';
import ReactDOM from 'react-dom/client';
import {MfTipWidget, MfCommentWidget} from '../../src';
// import {MfCommentWidget, MfTipWidget} from '@dforo3/metaforo-sdk/dist/esm';

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
                if (!checkAttrs(e, ['siteName', 'pageId', 'receiverAddress', 'receiverUsername', 'receiverChainId'])) {
                    return;
                }

                showTipDialog(event.target);
            }
        });
    }
}

function showTipDialog(element: HTMLElement) {
    console.log('show tip dialog', element);
    let div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    root.render(<MfTipWidget props={element.attributes} />);
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
        if (!checkAttrs(e, ['siteName', 'pageId'])) {
            continue;
        }

        showComment(e);
    }
}

function checkAttrs(e: HTMLElement, attrs: string[]) {
    let missingAttrs = [] as string[];
    attrs.forEach((attr) => {
        if (!e.attributes.getNamedItem(attr)) missingAttrs.push(attr);
    });
    if (missingAttrs.length > 0) {
        console.warn('Missing attributes ' + missingAttrs.join(',') + ' for metaforo-tip. element is ', e);
        return false;
    } else {
        return true;
    }
}

function showComment(e: HTMLElement) {
    const root = ReactDOM.createRoot(e);
    root.render(<MfCommentWidget props={e.attributes} />);
}

// endregion ---- Comment ----
