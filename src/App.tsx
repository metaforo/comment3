import React from 'react';
import TipWidget from "./screens/TipWidget";

function App() {
    return (
        <div className="App">
            <TipWidget groupName={'test1130'} pageId={1231}
                       receiver={{address: '', chainId: 1, username: 'TestAccount'}}/>
        </div>
    );
}

export default App;
