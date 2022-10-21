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
                    if (!e.attributes.getNamedItem('siteName')
                        || !e.attributes.getNamedItem('pageId')
                        || !e.attributes.getNamedItem('receiverAddress')
                        || !e.attributes.getNamedItem('receiverUsername')
                        || !e.attributes.getNamedItem('receiverChainId')
                    ) {
                        console.log('Missing attributes for metaforo-tip. element is ' + e.id);
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
