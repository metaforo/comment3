import React, {Dispatch, useContext, useReducer} from "react";
import {UserStatus} from "../utils/Constants";
import {Storage} from "../utils/Storage";

export interface UserInfoState {
    loginStatus: number,
    username?: string,
    avatar?: string,
    ethAddress?: string,
    arAddress?: string,
}

const initialUserState = {
    loginStatus: UserStatus.isChecking,
    username: undefined,
    avatar: undefined,
    ethAddress: undefined,
    arAddress: undefined,
};

const UserContext = React.createContext<{ userInfoState: UserInfoState, setUserState: Dispatch<UserInfoState> }>({
    userInfoState: initialUserState,
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
}

export function updateUserStatusByLoginResponse(res: any, dispatch: Dispatch<UserInfoState>) {
    let ethAddress, arAddress;
    res.user.web3_public_keys.forEach((web3Key: any) => {
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
        username: res.user.username,
        avatar: res.user.photo_url,
        ethAddress: ethAddress,
        arAddress: arAddress,
    } as UserInfoState;
    dispatch(user);
}

export const UserContextProvider = ({children}: { children: JSX.Element }) => {
    const [state, dispatch] = useReducer((state: UserInfoState, newState: Partial<UserInfoState>) => ({
        ...state, ...newState
    }), initialUserState);
    return (
        <UserContext.Provider value={{userInfoState: state, setUserState: dispatch}}>
            {children}
        </UserContext.Provider>
    )
}