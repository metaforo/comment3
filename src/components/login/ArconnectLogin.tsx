import {loginByWallet, LoginParam} from '../../api/ApiService';
import {GlobalState} from '../../context/GlobalContext';

export async function connectToAr(globalState: GlobalState) {
    // @ts-ignore
    const {arweaveWallet} = window;
    await arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGNATURE', 'ACCESS_PUBLIC_KEY']);
    const account = await arweaveWallet.getActiveAddress();
    const publicKey = await arweaveWallet.getActivePublicKey();
    const signMsg = 'Please sign your request to prove your identity. This is not a transaction.';
    const hexSignMsg = Buffer.from(signMsg, 'hex');
    const signResult = await arweaveWallet
        .signature(hexSignMsg, {
            name: 'RSA-PSS',
            saltLength: 32,
        })
        .then((res: any) => {
            return JSON.stringify(Object.values(res));
        });

    const loginParam = {
        web3_public_key: account,
        web3_address: publicKey,
        sign: signResult,
        signMsg: signMsg,
        wallet_type: 3,
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
