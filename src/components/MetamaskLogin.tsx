import {updateUserStatusByLoginResponse, UserInfoState} from "../context/UserContext";
import {typedData} from "../utils/Util";
import {loginToEth} from "../api/ApiService";
import {LoginType} from "../utils/Constants";
import {Storage} from "../utils/Storage";
import {Dispatch} from "react";

export async function connectToMetamask(setUserState: Dispatch<UserInfoState>) {
    // @ts-ignore
    const {ethereum} = window;
    const account = await ethereum.request({
        method: 'eth_requestAccounts'
    }).then((res: any) => {
        return res[0];
    });
    const signMsg = JSON.stringify(typedData(account));
    const sign = await ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [account.toLowerCase(), signMsg],
    }).then((res: any) => {
        console.log(JSON.stringify(res));
        return res;
    });

    loginToEth(account, sign, signMsg).then(res => {
        updateUserStatusByLoginResponse(res, setUserState);
        Storage.saveItem(Storage.lastLoginType, LoginType.eth);
    });
    return true;
}