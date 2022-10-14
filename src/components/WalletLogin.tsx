import React from "react";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import {login} from "../api/ApiService";

export default class WalletLogin extends React.Component<any, any> {
    connector: WalletConnect;

    constructor(props: any) {
        super(props);

        this.connector = new WalletConnect({
            bridge: 'https://bridge.walletconnect.org',
            qrcodeModal: QRCodeModal,
        });
        this.connector.on("connect", (error, payload) => {
            this.onConnect(error, payload);
        })
        // this.connector.on("disconnect", (error, payload) => {
        //     this.onDisconnect(error, payload);
        // })
    }

    // region ---- Connect ----

    startWalletConnect = async () => {
        if (true) {
            this.debugLogin();
            return;
        }

        if (this.connector.connected) {
            await this.connector.killSession();
        }

        await this.connector.createSession();
    }

    onConnect = async (error: Error | null, payload: any) => {
        if (error) {
            throw error;
        }

        const {accounts, chainId} = payload.params[0];
        let account = accounts[0];
        let msg = JSON.stringify(this.typedData(account));
        let sign = await this.requestSignData(account, msg);

        login(account, sign, msg).then(res => {
            console.log(res);
        })
    }

    requestSignData = (address: string, msg: string) => {
        return this.connector.signTypedData([address, msg])
            .then((result) => {
                return result;
            })
            .catch((error) => {
                console.error(error);
            })
    }

    // endregion ---- Connect ----


    typedData(address: string) {
        return {
            types: {
                EIP712Domain: [{name: "name", type: "string"}, {name: "version", type: "string"}, {
                    name: "chainId", type: "uint256"
                },], Login: [{name: "account", type: "address"}, {name: "message", type: "string"},],
            }, primaryType: "Login", domain: {
                name: "Metaqus", version: "1.0", chainId: 1
            }, message: {
                account: address, message: "Login to Metaqus",
            },
        }
    }

    debugLogin() {
        let address = '0x9d7ba953587b87c474a10beb65809ea489f026bd';
        let sign = '0x29317c449554281b69cc13a4a7370a2c6a2cd6b8fc7d2576a78d8d1f0346cde836d66b576a6fcb4f0b2715f052f5fd2b669dfd123f41fe8e8eb7dcea2b4687aa1b';
        let msg = JSON.stringify(this.typedData(address));
        login(address, sign, msg).then(res => {
            console.log(res);
        })
    }

    render() {
        return (<div>
            <button onClick={this.startWalletConnect}>Wallet Connect</button>
        </div>);
    }


}