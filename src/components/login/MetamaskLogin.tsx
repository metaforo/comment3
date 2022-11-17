import {updateUserStatusByLoginResponse, UserInfoState} from "../../context/UserContext";
import {typedData} from "../../utils/Util";
import {loginToEth} from "../../api/ApiService";
import {LoginType} from "../../utils/Constants";
import {Storage} from "../../utils/Storage";
import {Dispatch} from "react";
import log from "../../utils/LogUtil";

export async function connectToMetamask(setUserState: Dispatch<UserInfoState>) {
    // @ts-ignore
    const {ethereum} = window;
    const account = await ethereum.request({
        method: 'eth_requestAccounts'
    }).then((res: any) => {
        return res[0];
    }).catch((e: any) => {
        console.warn(e);
        return false;
    });
    if (!account) {
        return false;
    }
    const signMsg = JSON.stringify(typedData(account));
    const sign = await ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [account.toLowerCase(), signMsg],
    }).then((res: any) => {
        log(JSON.stringify(res));
        return res;
    }).catch((e: any) => {
        console.warn(e);
        return false;
    });
    if (!sign) {
        return false;
    }
    return await loginToEth(account, sign, signMsg);
    // await loginToEth(account, sign, signMsg).then(res => {
    //     updateUserStatusByLoginResponse(res, setUserState);
    //     Storage.saveItem(Storage.lastLoginType, LoginType.eth);
    // });
    // return true;
}