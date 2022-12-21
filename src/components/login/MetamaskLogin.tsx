import {typedData} from '../../utils/Util';
import {loginByWallet, LoginParam} from '../../api/ApiService';
import log from '../../utils/LogUtil';
import {GlobalState} from '../../context/GlobalContext';

export async function connectToMetamask(globalState: GlobalState) {
    // @ts-ignore
    const {ethereum} = window;
    const targetNetworkId = '0x1';
    const chainSwitch = await ethereum
        .request({
            method: 'wallet_switchEthereumChain',
            params: [{chainId: targetNetworkId}],
        })
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });
    if (!chainSwitch) {
        return false;
    } else {
        await new Promise((resolve) => setTimeout(resolve, 500));
    }

    const account = await ethereum
        .request({
            method: 'eth_requestAccounts',
        })
        .then((res: any) => {
            return res[0];
        })
        .catch((e: any) => {
            console.warn(e);
            return false;
        });
    if (!account) {
        return false;
    }
    const signMsg = JSON.stringify(typedData(account));
    const sign = await ethereum
        .request({
            method: 'eth_signTypedData_v4',
            params: [account.toLowerCase(), signMsg],
        })
        .then((res: any) => {
            log(JSON.stringify(res));
            return res;
        })
        .catch((e: any) => {
            console.warn(e);
            return false;
        });
    if (!sign) {
        return false;
    }

    const loginParam = {
        web3_public_key: account,
        sign: sign,
        signMsg: signMsg,
        wallet_type: 5,
    } as LoginParam;
    if (globalState.siteName) {
        loginParam.group_name = globalState.siteName;
        if (globalState.preferDisplayName && globalState.preferDisplayName != '') {
            loginParam.display_name = globalState.preferDisplayName;
        }
        if (globalState.preferDisplayAvatar && globalState.preferDisplayAvatar != '') {
            loginParam.display_avatar = globalState.preferDisplayAvatar;
        }
    }

    return await loginByWallet(loginParam);
}
