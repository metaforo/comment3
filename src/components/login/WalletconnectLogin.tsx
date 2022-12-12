import {loginByWallet, LoginParam} from '../../api/ApiService';
import {typedData} from '../../utils/Util';
import WalletConnectProvider from '@walletconnect/web3-provider';
import {Global} from '../../utils/GlobalVariables';

export async function connectToWalletConnectByProvider() {
    const getProvider = () => new WalletConnectProvider({infuraId: '27804223e321460cb5682ca4b676f224'});
    try {
        await getProvider().wc.killSession();
    } catch (e) {
        // do nothing
    }
    // return false;
    const provider = getProvider();

    const connectResult = await provider
        .enable()
        .then((value) => {
            return value;
        })
        .catch(() => {
            return null;
        });

    if (connectResult == null || connectResult.length === 0) {
        return false;
    }

    const account = connectResult[0];
    const msg = JSON.stringify(typedData(account));
    const sign = await provider
        .request({
            method: 'eth_signTypedData_v4',
            params: [account, msg],
        })
        .then((value) => {
            return value;
        })
        .catch(() => {
            return null;
        });

    if (sign == null) {
        return false;
    }
    let displayName;
    if (Global.preferDisplayName && Global.preferDisplayName != '') {
        displayName = Global.preferDisplayName;
    }
    return await loginByWallet({
        web3_public_key: account,
        sign: sign,
        signMsg: msg,
        wallet_type: 5,
        display_name: displayName,
        group_name: displayName ? Global.siteName : undefined,
    } as LoginParam);
}
