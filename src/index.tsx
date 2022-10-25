import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./css/common.css";

window.Buffer = window.Buffer || require("buffer").Buffer;

const elements = document.getElementsByClassName('metaforo-tip');
if (elements) {
    for (let i = 0; i < elements.length; i++) {
        const e = elements.item(i);
        if (e && e instanceof HTMLElement) {
            e.addEventListener('click', (event) => {
                if (event.target && event.target instanceof HTMLElement) {
                    let missingAttrs = [];
                    if (!e.attributes.getNamedItem('siteName')) missingAttrs.push('siteName');
                    if (!e.attributes.getNamedItem('pageId')) missingAttrs.push('pageId');
                    if (!e.attributes.getNamedItem('receiverAddress')) missingAttrs.push('receiverAddress');
                    if (!e.attributes.getNamedItem('receiverUsername')) missingAttrs.push('receiverUsername');
                    if (!e.attributes.getNamedItem('receiverChainId')) missingAttrs.push('sireceiverChainIdteName');
                    if (missingAttrs.length > 0) {
                        console.warn('Missing attributes ' + missingAttrs.join(',') + ' for metaforo-tip. element is ', e);
                        return;
                    }

                    showTipDialog(event.target);
                }
            });
        }
    }
}

function showTipDialog(element: HTMLElement) {
    let div = document.createElement("div");
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    root.render(<App props={element.attributes}/>);
}
