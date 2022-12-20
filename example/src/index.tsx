import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    MfCommentWidget,
    MfCommentWidgetProps,
    MfLikeWidget,
    MfLikeWidgetProps,
    MfTippingWidget,
    MfTippingWidgetProps,
} from '@dforo3/metaforo-sdk';

// When a single JS is referenced via HTML, the value is used to automatically iterate through
// the specified tag name of the HTML and generate the corresponding component
const autoInitFromHtml = true;
const commentWidgetClass = 'metaforo-comment';
const tippingWidgetClass = 'metaforo-tipping';
const likeWidgetClass = 'metaforo-like';

/// show tipping dialog
function showTippingDialog(element: HTMLElement, props: MfTippingWidgetProps) {
    let div = document.createElement('div');
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    root.render(<MfTippingWidget {...props} />);
}

/// show comment list in specific div element.
function showCommentList(element: HTMLElement, props: MfCommentWidgetProps) {
    ReactDOM.createRoot(element).render(<MfCommentWidget {...props} />);
}

function showLikeButton(element: HTMLElement, props: MfLikeWidgetProps) {
    ReactDOM.createRoot(element).render(<MfLikeWidget {...props} />);
}

// region ---- Auto init from html ----

if (autoInitFromHtml) {
    initMetaforoSdkFromHtml();
}

function initMetaforoSdkFromHtml() {
    initMfTippingWidget();
    initMfCommentWidget();
    initMfLikeWidget();
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
                    showTippingDialog(element, {
                        siteName: attrs.getNamedItem('siteName')!.value,
                        pageId: attrs.getNamedItem('pageId')!.value,
                        receiverAddress: attrs.getNamedItem('receiverAddress')!.value,
                        receiverUsername: attrs.getNamedItem('receiverUsername')!.value,
                        receiverChainId: parseInt(attrs.getNamedItem('receiverChainId')!.value),
                        theme: attrs.getNamedItem('theme')?.value ?? undefined,
                        debug: attrs.getNamedItem('debug')?.value === 'true',
                        demo: attrs.getNamedItem('demo')?.value === 'true',
                    } as MfTippingWidgetProps);
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
            showCommentList(element, {
                siteName: attrs.getNamedItem('siteName')!.value,
                pageId: attrs.getNamedItem('pageId')!.value,
                userDisplayName: attrs.getNamedItem('userDisplayName')?.value ?? undefined,
                userAvatar: attrs.getNamedItem('userAvatar')?.value ?? undefined,
                disableEditProfile: attrs.getNamedItem('disableEditProfile')?.value === 'true' ?? undefined,
                theme: attrs.getNamedItem('theme')?.value ?? undefined,
                debug: attrs.getNamedItem('debug')?.value === 'true',
                demo: attrs.getNamedItem('demo')?.value === 'true',
            } as MfCommentWidgetProps);
        }
    }
}

function initMfLikeWidget() {
    const likeWidgets = document.getElementsByClassName(likeWidgetClass);
    if (likeWidgets) {
        for (let i = 0; i < likeWidgets.length; i++) {
            const element = likeWidgets.item(i);
            if (!(element && element instanceof HTMLElement)) {
                continue;
            }
            if (!checkAttrs(element, ['siteName', 'pageId'])) {
                continue;
            }

            const attrs = element.attributes;

            showLikeButton(element, {
                siteName: attrs.getNamedItem('siteName')!.value,
                pageId: attrs.getNamedItem('pageId')!.value,
                userDisplayName: attrs.getNamedItem('userDisplayName')?.value ?? undefined,
                userAvatar: attrs.getNamedItem('userAvatar')?.value ?? undefined,
                theme: attrs.getNamedItem('theme')?.value ?? undefined,
                debug: attrs.getNamedItem('debug')?.value === 'true',
            } as MfLikeWidgetProps);
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
