import {updateUserStatusByLoginResponse, UserInfoState} from "../../context/UserContext";
import {loginToAr} from "../../api/ApiService";
import {Storage} from "../../utils/Storage";
import {LoginType} from "../../utils/Constants";
import {Dispatch} from "react";

export async function connectToAr(setUserState: Dispatch<UserInfoState>) {
    // @ts-ignore
    const {arweaveWallet} = window;
    await arweaveWallet.connect([
        "ACCESS_ADDRESS",
        "SIGNATURE",
        "ACCESS_PUBLIC_KEY",
    ]);
    const account = await arweaveWallet.getActiveAddress();
    const publicKey = await arweaveWallet.getActivePublicKey();
    const signMsg = "Please sign your request to prove your identity. This is not a transaction.";
    const hexSignMsg = Buffer.from(signMsg, 'hex');
    const signResult = await arweaveWallet.signature(hexSignMsg,
        {
            name: 'RSA-PSS',
            saltLength: 32,
        }).then((res: any) => {
        return JSON.stringify(Object.values(res));
    });

    await loginToAr(account, publicKey, signResult, signMsg,).then(res => {
        updateUserStatusByLoginResponse(res, setUserState);
        Storage.saveItem(Storage.lastLoginType, LoginType.ar);
    });

    return true;
}