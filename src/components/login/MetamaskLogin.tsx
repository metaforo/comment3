import {UserInfoState} from "../../context/UserContext";
import {typedData} from "../../utils/Util";
import {loginToEth} from "../../api/ApiService";
import {Dispatch} from "react";
import log from "../../utils/LogUtil";

export async function connectToMetamask(setUserState: Dispatch<UserInfoState>) {
    // @ts-ignore
    const {ethereum} = window;
    const targetNetworkId = '0x1';
    const chainSwitch = await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: targetNetworkId}],
    }).then((res: any) => {
        return true;
    }).catch((e: any) => {
        return false;
    });
    if (!chainSwitch) {
        return false;
    } else {
        await new Promise(resolve => setTimeout(resolve, 500));
    }

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