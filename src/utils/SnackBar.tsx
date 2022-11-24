import {createContext, Dispatch, useContext, useReducer} from 'react';
import {Snackbar} from '@mui/material';

interface SnackBarState {
    open?: boolean;
    message: string;
    timeout?: number;
}

const initialSnakeBarState: SnackBarState = {
    open: false,
    message: '',
    timeout: 6000,
};

export const SnackBarContext = createContext<{snakeBarState: SnackBarState; snakeBarDispatch: Dispatch<SnackBarState>}>(
    {
        snakeBarState: initialSnakeBarState,
        snakeBarDispatch: () => null,
    },
);

export function useSnakeBarContext() {
    return useContext(SnackBarContext);
}

export const SnackBarContextProvider = ({children}: {children: JSX.Element}) => {
    const [state, dispatch] = useReducer(
        (state: SnackBarState, newState: Partial<SnackBarState>) => ({
            ...state,
            ...newState,
        }),
        initialSnakeBarState,
    );
    return (
        <SnackBarContext.Provider value={{snakeBarState: state, snakeBarDispatch: dispatch}}>
            <Snackbar
                open={state.open}
                autoHideDuration={state.timeout}
                message={state.message}
                onClose={() => {
                    dispatch(initialSnakeBarState);
                }}
            />
            {children}
        </SnackBarContext.Provider>
    );
};
