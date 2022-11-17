import {loginToEth} from "../../api/ApiService";
import {typedData} from "../../utils/Util";
import WalletConnectProvider from "@walletconnect/web3-provider";

export async function connectToWalletConnectByProvider() {
    const getProvider = () => new WalletConnectProvider(
        {infuraId: "27804223e321460cb5682ca4b676f224",}
    );
    try {
        await getProvider().wc.killSession();
    } catch (e) {
    }
    // return false;
    const provider = getProvider();

    const connectResult = await provider.enable().then((value) => {
        return value;
    }).catch((e) => {
        return null;
    });

    if (connectResult == null || connectResult.length === 0) {
        return false;
    }

    const account = connectResult[0];
    let msg = JSON.stringify(typedData(account));
    let sign = await provider.request({
        method: 'eth_signTypedData_v4',
        params: [account, msg],
    }).then((value) => {
        return value;
    }).catch((e) => {
        return null;
    });

    if (sign == null) {
        return false;
    }

    return await loginToEth(account, sign, msg);
}