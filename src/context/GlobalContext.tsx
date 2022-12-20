import React, {Dispatch, useContext, useReducer} from 'react';

export interface GlobalState {
    isDebug: boolean;
    isDemo: boolean;
    siteName: string;
    pageId: string;
    preferDisplayName: string | undefined;
    preferDisplayAvatar: string | undefined;
    disableEditProfile: boolean;
}

export const initGlobalState = () => {
    return {
        isDebug: false,
        isDemo: false,
        siteName: '',
        pageId: '',
        preferDisplayName: undefined,
        preferDisplayAvatar: undefined,
        disableEditProfile: false,
    };
};

const GlobalContext = React.createContext<{globalState: GlobalState; setGlobalState: Dispatch<GlobalState>}>({
    globalState: initGlobalState(),
    setGlobalState: () => null,
});

export function useGlobalContext() {
    return useContext(GlobalContext);
}

export const GlobalContextProvider = (props: any) => {
    const {children, ...initState} = props;
    const [state, dispatch] = useReducer(
        (state: GlobalState, newState: Partial<GlobalState>) => ({
            ...state,
            ...newState,
        }),
        initState,
    );

    return (
        <GlobalContext.Provider value={{globalState: state, setGlobalState: dispatch}}>
            {children}
        </GlobalContext.Provider>
    );
};
