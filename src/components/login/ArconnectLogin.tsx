import {loginByWallet, LoginParam} from '../../api/ApiService';
import {Global} from '../../utils/GlobalVariables';

export async function connectToAr() {
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

    let displayName;
    if (Global.preferDisplayName && Global.preferDisplayName != '') {
        displayName = Global.preferDisplayName;
    }
    return await loginByWallet({
        web3_public_key: account,
        web3_address: publicKey,
        sign: signResult,
        signMsg: signMsg,
        wallet_type: 3,
        display_name: displayName,
        group_name: displayName ? Global.siteName : undefined,
    } as LoginParam);
}
