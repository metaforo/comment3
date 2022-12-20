import {UserInfoState} from '../context/UserContext';
import {Dispatch} from 'react';
import {EventItem, EventTypeRemove, EventTypeRemoveAll, EventTypeSave, Storage} from './Storage';
import {initApiService, refreshLoginStatus} from '../api/ApiService';
import {UserStatus} from './Constants';
import {removeEverpayInstance} from '../components/tipping/Everpay';
import log from './LogUtil';

export function refreshByStorage(
    e: Event | CustomEvent<EventItem>,
    groupName: string,
    userInfoState: UserInfoState,
    dispatch: Dispatch<UserInfoState>,
) {
    let needRefreshLogin = false;
    if (e instanceof CustomEvent<EventItem>) {
        if (e.detail.type === EventTypeSave && e.detail.key === Storage.userToken && userInfoState.loginStatus === UserStatus.notLogin) {
            needRefreshLogin = true;
        } else if (e.detail.type === EventTypeRemove && e.detail.key === Storage.userToken && userInfoState.loginStatus === UserStatus.login) {
            needRefreshLogin = true;
        } else if (e.detail.type === EventTypeRemoveAll && userInfoState.loginStatus === UserStatus.login) {
            needRefreshLogin = true;
        }
    } else if (e instanceof StorageEvent) {
        if (userInfoState.loginStatus !== UserStatus.isChecking) {
            const prevLoginStatus = userInfoState.loginStatus === UserStatus.login;
            if (e.key === Storage.userToken) { // login event
                if (!prevLoginStatus) {
                    needRefreshLogin = true;
                }
            } else if (e.key == null || e.key == '') { // logout event
                if (prevLoginStatus) {
                    needRefreshLogin = true;
                }
            }
        }
    }

    if (needRefreshLogin) {
        log('refresh', e);
        initLoginStatus(groupName, userInfoState, dispatch);
    }
}

export async function initLoginStatus(
    groupName: string,
    userInfoState: UserInfoState,
    dispatch: Dispatch<UserInfoState>,
) {
    const userToken = Storage.getItem(Storage.userToken);
    if (userToken) {
        initApiService(userToken);
        return refreshLoginStatus(groupName).then((res) => {
            if (res.data && res.data.user) {
                userInfoState.loginStatus = UserStatus.login;
                updateUserStatusByLoginResponse(groupName, res.data.user, dispatch);
                return true;
            } else {
                userInfoState.loginStatus = UserStatus.notLogin;
                dispatch(userInfoState);
                return false;
            }
        });
    } else {
        userInfoState.loginStatus = UserStatus.notLogin;
        dispatch(userInfoState);
        return false;
    }
}


export function updateUserStatusByLocalStorage(userInfoState: UserInfoState, dispatch: Dispatch<UserInfoState>) {
    userInfoState.username = Storage.getItem(Storage.userName) ?? '';
    userInfoState.displayName = Storage.getItem(Storage.displayName) ?? '';
    userInfoState.avatar = Storage.getItem(Storage.userAvatar) ?? '';
    userInfoState.ethAddress = Storage.getItem(Storage.userEthAddress) ?? '';
    userInfoState.arAddress = Storage.getItem(Storage.userArAddress) ?? '';
    dispatch(userInfoState);
    initApiService(Storage.getItem(Storage.userToken) ?? '');
}

export function updateUserStatusByLoginResponse(
    groupName: string,
    res: any,
    dispatch: Dispatch<UserInfoState>,
    isRegister?: boolean,
) {
    let ethAddress, arAddress;
    if (res.web3_public_keys) {
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
    }

    let displayName, displayAvatar;
    if (res.group_profiles) {
        res.group_profiles.forEach((dn: any) => {
            if (dn.group_name.toLowerCase() === groupName.toLowerCase()) {
                displayName = dn.display_name;
                displayAvatar = dn.display_avatar;
            }
        });
    }

    const user = {
        loginStatus: UserStatus.login,
        username: res.username,
        displayName: displayName,
        avatar: displayAvatar ?? res.photo_url,
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
        displayName: undefined,
        avatar: undefined,
        ethAddress: undefined,
        arAddress: undefined,
        isNew: false,
    });
};