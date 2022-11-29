import React from 'react';
import ReactDOM from 'react-dom/client';
import {MfCommentWidget, MfTippingWidget} from '@dforo3/metaforo-sdk';

// When a single JS is referenced via HTML, the value is used to automatically iterate through
// the specified tag name of the HTML and generate the corresponding component
const autoInitFromHtml = true;
const commentWidgetClass = 'metaforo-comment';
const tippingWidgetClass = 'metaforo-tipping';

/// show tipping dialog
function showTippingDialog(
    siteName: string,
    pageId: string,
    receiverAddress: string,
    receiverUsername: string,
    receiverChainId: number,
    theme?: string,
    debug?: boolean,
    demo?: boolean,
) {
    let div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    root.render(
        <MfTippingWidget
            siteName={siteName}
            pageId={pageId}
            receiverAddress={receiverAddress}
            receiverChainId={receiverChainId}
            receiverUsername={receiverUsername}
            theme={theme}
            debug={debug}
            demo={demo}
        />,
    );
}

/// show comment list in specific div element.
function showCommentList(
    element: HTMLElement,
    siteName: string,
    pageId: string,
    theme?: string,
    debug?: boolean,
    demo?: boolean,
) {
    ReactDOM.createRoot(element).render(
        <MfCommentWidget siteName={siteName} pageId={pageId} theme={theme} debug={debug} demo={demo} />,
    );
}

// region ---- Auto init from html ----

if (autoInitFromHtml) {
    initMetaforoSdkFromHtml();
}

function initMetaforoSdkFromHtml() {
    initMfTippingWidget();
    initMfCommentWidget();
}

function initMfTippingWidget() {
    const tippingWidgetList = document.getElementsByClassName(tippingWidgetClass);
    if (tippingWidgetList) {
        for (let i = 0; i < tippingWidgetList.length; i++) {
            const element = tippingWidgetList.item(i);
            if (!(element && element instanceof HTMLElement)) {
                continue;
            }
            element.addEventListener('click', (event) => {
                if (event.target && event.target instanceof HTMLElement) {
                    if (
                        !checkAttrs(event.target, [
                            'siteName',
                            'pageId',
                            'receiverAddress',
                            'receiverUsername',
                            'receiverChainId',
                        ])
                    ) {
                        return;
                    }

                    const attrs = event.target.attributes;
                    showTippingDialog(
                        attrs.getNamedItem('siteName')!.value,
                        attrs.getNamedItem('pageId')!.value,
                        attrs.getNamedItem('receiverAddress')!.value,
                        attrs.getNamedItem('receiverUsername')!.value,
                        parseInt(attrs.getNamedItem('receiverChainId')!.value),
                        attrs.getNamedItem('theme')?.value ?? undefined,
                        attrs.getNamedItem('debug')?.value === 'true',
                        attrs.getNamedItem('demo')?.value === 'true',
                    );
                }
            });
        }
    }
}

function initMfCommentWidget() {
    const commentWidgets = document.getElementsByClassName(commentWidgetClass);
    if (commentWidgets) {
        for (let i = 0; i < commentWidgets.length; i++) {
            const element = commentWidgets.item(i);
            if (!(element && element instanceof HTMLElement)) {
                continue;
            }
            if (!checkAttrs(element, ['siteName', 'pageId'])) {
                continue;
            }
            const attrs = element.attributes;
            showCommentList(
                element,
                attrs.getNamedItem('siteName')!.value,
                attrs.getNamedItem('pageId')!.value,
                attrs.getNamedItem('theme')?.value ?? undefined,
                attrs.getNamedItem('debug')?.value === 'true',
                attrs.getNamedItem('demo')?.value === 'true',
            );
        }
    }
}

function checkAttrs(e: HTMLElement, attrs: string[]) {
    let missingAttrs = [] as string[];
    attrs.forEach((attr) => {
        if (!e.attributes.getNamedItem(attr)) missingAttrs.push(attr);
    });
    if (missingAttrs.length > 0) {
        console.warn('Missing attributes ' + missingAttrs.join(',') + ' for metaforo-sdk. element is ', e);
        return false;
    } else {
        return true;
    }
}

// endregion ---- Auto init from html ----
