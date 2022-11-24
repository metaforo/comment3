import React, {Dispatch, useContext, useReducer} from 'react';
import {UserStatus} from '../utils/Constants';
import {Storage} from '../utils/Storage';
import {initApiService} from '../api/ApiService';
import {removeEverpayInstance} from '../components/tipping/Everpay';

export interface UserInfoState {
    loginStatus: number;
    username?: string;
    avatar?: string;
    ethAddress?: string;
    arAddress?: string;
    isNew: boolean;
}

function initialUserState() {
    return {
        loginStatus: UserStatus.isChecking,
        username: undefined,
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

export function updateUserStatusByLocalStorage(userInfoState: UserInfoState, dispatch: Dispatch<UserInfoState>) {
    userInfoState.username = Storage.getItem(Storage.userName) ?? '';
    userInfoState.avatar = Storage.getItem(Storage.userAvatar) ?? '';
    userInfoState.ethAddress = Storage.getItem(Storage.userEthAddress) ?? '';
    userInfoState.arAddress = Storage.getItem(Storage.userArAddress) ?? '';
    dispatch(userInfoState);
    initApiService(Storage.getItem(Storage.userToken) ?? '');
}

export function updateUserStatusByLoginResponse(res: any, dispatch: Dispatch<UserInfoState>, isRegister?: boolean) {
    let ethAddress, arAddress;
    res.web3_public_keys.forEach((web3Key: any) => {
        switch (web3Key.type) {
            case 5:
                ethAddress = web3Key.address;
                break;
            case 3:
                arAddress = web3Key.address;
                break;
            default:
                // do nothing.
                break;
        }
    });

    const user = {
        loginStatus: UserStatus.login,
        username: res.username,
        avatar: res.photo_url,
        ethAddress: ethAddress,
        arAddress: arAddress,
        isNew: isRegister ?? false,
    } as UserInfoState;
    dispatch(user);
}

export const logout = (setUserState: Dispatch<UserInfoState>) => {
    Storage.removeAll();
    removeEverpayInstance();
    setUserState({
        loginStatus: UserStatus.notLogin,
        username: undefined,
        avatar: undefined,
        ethAddress: undefined,
        arAddress: undefined,
        isNew: false,
    });
};

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
