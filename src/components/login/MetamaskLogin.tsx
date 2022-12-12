import {typedData} from '../../utils/Util';
import {LoginParam, loginByWallet} from '../../api/ApiService';
import log from '../../utils/LogUtil';
import {Global} from '../../utils/GlobalVariables';

export async function connectToMetamask() {
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
    let displayName;
    if (Global.preferDisplayName && Global.preferDisplayName != '') {
        displayName = Global.preferDisplayName;
    }
    return await loginByWallet({
        web3_public_key: account,
        sign: sign,
        signMsg: signMsg,
        wallet_type: 5,
        display_name: displayName,
        group_name: displayName ? Global.siteName : undefined,
    } as LoginParam);
}
