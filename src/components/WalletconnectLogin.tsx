import React, {Dispatch} from "react";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import {loginToEth} from "../api/ApiService";
import {updateUserStatusByLoginResponse, UserInfoState} from "../context/UserContext";
import {typedData} from "../utils/Util";
import {Storage} from "../utils/Storage";
import {LoginType} from "../utils/Constants";

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

        loginToEth(account, sign, msg).then(res => {
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