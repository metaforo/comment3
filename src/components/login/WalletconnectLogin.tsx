import {loginByWallet, LoginParam} from '../../api/ApiService';
import {typedData} from '../../utils/Util';
import WalletConnectProvider from '@walletconnect/web3-provider';
import {GlobalState} from '../../context/GlobalContext';

export async function connectToWalletConnectByProvider(globalState: GlobalState) {
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

    const loginParam = {
        web3_public_key: account,
        sign: sign,
        signMsg: msg,
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
