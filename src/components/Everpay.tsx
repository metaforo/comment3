import Everpay, {ChainType} from "everpay";
import {UserInfoState} from "../context/UserContext";
import {LoginType, UserStatus} from "../utils/Constants";
import {ethers} from "ethers";
import {Storage} from "../utils/Storage";

interface TipEverpayProps {
    toAccount: string,
    tokenType: string,
    amount: number,
    userInfoState: UserInfoState,
}

export default function tip(props: TipEverpayProps) {
    const hasLogin = props.userInfoState.loginStatus === UserStatus.login && (props.userInfoState.ethAddress || props.userInfoState.arAddress);
    if (!hasLogin) {
        return false;
    }

    // region ---- init everpay ----
    function initEverpay() {
        const loginType = Storage.getItem(Storage.lastLoginType) ?? '';
        if (loginType === LoginType.ar && props.userInfoState.arAddress) {
            return new Everpay({
                debug: false,
                account: props.userInfoState.arAddress,
                chainType: ChainType.arweave,
                arJWK: 'use_wallet',
            });
        } else if (props.userInfoState.ethAddress) { // loginType == eth || walletConnect
            const provider = new ethers.providers.Web3Provider(
                (window as any).ethereum
            );
            const signer = provider.getSigner();
            return new Everpay(
                {
                    debug: false,
                    account: props.userInfoState.ethAddress,
                    ethConnectedSigner: signer,
                }
            );
        }

        return null;
    }

    const everpay = initEverpay();
    if (!everpay) {
        return null;
    }

    return everpay.transfer({
        to: props.toAccount,
        symbol: props.tokenType,
        amount: props.amount.toString(),
        data: {
            platform: "metaforo-sdk",
        },
    }).then((response: any) => {
        return response;
    }).catch((error: any) => {
        return error;
    });
}