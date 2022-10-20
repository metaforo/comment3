import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./css/common.css";

window.Buffer = window.Buffer || require("buffer").Buffer;
const tipElement = document.getElementById('metaforo-tip');
if (tipElement) {
    const root = ReactDOM.createRoot(
        tipElement as HTMLElement
    );
    root.render(
        <React.StrictMode>
            <App props={tipElement.attributes}/>
        </React.StrictMode>
    );
} else {
    // Do nothing.
}

