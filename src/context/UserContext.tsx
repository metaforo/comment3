import React from "react";
import {UserStatus} from "../utils/Constants";

export interface MfUserInfo {
    status: number,
    username?: string,
    avatar?: string,
    walletAddress?: string,
}

let status: MfUserInfo = {
    status: UserStatus.isChecking,
}

export interface UserInfoContext {
    userInfo: MfUserInfo,
    updateUserInfo: (userInfo: MfUserInfo) => void,
}

export const UserContext = React.createContext<UserInfoContext | null>(null);