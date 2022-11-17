import {Dispatch} from "react";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import {loginToEth} from "../../api/ApiService";
import {updateUserStatusByLoginResponse, UserInfoState} from "../../context/UserContext";
import {typedData} from "../../utils/Util";
import {Storage} from "../../utils/Storage";
import {LoginType} from "../../utils/Constants";
import WalletConnectProvider from "@walletconnect/web3-provider";

export async function connectToWalletconnect(setUserState: Dispatch<UserInfoState>) {
    // region ---- functions ----

    const onConnect = async (error: Error | null, payload: any) => {
        if (error) {
            throw error;
        }

        const {accounts} = payload.params[0];
        let account = accounts[0];
        let msg = JSON.stringify(typedData(account));
        let sign = await requestSignData(account, msg);

        await loginToEth(account, sign, msg).then(res => {
            updateUserStatusByLoginResponse(res, setUserState);
            Storage.saveItem(Storage.lastLoginType, LoginType.walletConnect);
        });
    }

    const requestSignData = (address: string, msg: string) => {
        return connector.signTypedData([address, msg])
            .then((result) => {
                return result;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    // endregion ---- functions ----

    const connector = new WalletConnect({
        bridge: 'https://bridge.walletconnect.org',
        qrcodeModal: QRCodeModal,
    });

    connector.on("connect", (error, payload) => {
        onConnect(error, payload);
    })

    if (connector.connected) {
        await connector.killSession();
    }
    await connector.createSession();
}

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