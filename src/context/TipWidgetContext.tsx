import {createContext, Dispatch, useContext, useReducer} from 'react';
import {TipAccount} from '../model/TipAccount';

export interface TipWidgetState {
    siteName: string;
    pageId: string;
    receiver: TipAccount;
}

const initialTipWidgetState: TipWidgetState = {
    pageId: '',
    siteName: '',
    receiver: {
        username: '',
        chainId: 1,
        address: '',
    },
};

const TipWidgetContext = createContext<{
    tipWidgetState: TipWidgetState;
    tipWidgetDispatch: Dispatch<TipWidgetState>;
}>({
    tipWidgetState: initialTipWidgetState,
    tipWidgetDispatch: () => null,
});

export function useTipWidgetContext() {
    return useContext(TipWidgetContext);
}

export const TipWidgetContextProvider = ({children}: {children: JSX.Element}) => {
    const [state, dispatch] = useReducer(
        (state: TipWidgetState, newState: Partial<TipWidgetState>) => ({
            ...state,
            ...newState,
        }),
        initialTipWidgetState,
    );
    return (
        <TipWidgetContext.Provider value={{tipWidgetState: state, tipWidgetDispatch: dispatch}}>
            {children}
        </TipWidgetContext.Provider>
    );
};
