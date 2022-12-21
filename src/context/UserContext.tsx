import React, {Dispatch, useContext, useReducer} from 'react';
import {UserStatus} from '../utils/Constants';

export interface UserInfoState {
    loginStatus: number;
    username?: string;
    displayName?: string;
    avatar?: string;
    ethAddress?: string;
    arAddress?: string;
    isNew: boolean;
}

function initialUserState() {
    return {
        loginStatus: UserStatus.isChecking,
        username: undefined,
        displayName: undefined,
        avatar: undefined,
        ethAddress: undefined,
        arAddress: undefined,
        isNew: false,
    };
}

const UserContext = React.createContext<{userInfoState: UserInfoState; setUserState: Dispatch<UserInfoState>}>({
    userInfoState: initialUserState(),
    setUserState: () => null,
});

export function useUserContext() {
    return useContext(UserContext);
}

export const UserContextProvider = ({children}: {children: JSX.Element}) => {
    const [state, dispatch] = useReducer(
        (state: UserInfoState, newState: Partial<UserInfoState>) => ({
            ...state,
            ...newState,
        }),
        initialUserState(),
    );
    return (
        <UserContext.Provider value={{userInfoState: state, setUserState: dispatch}}>{children}</UserContext.Provider>
    );
};
