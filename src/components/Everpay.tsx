import Everpay, {ChainType, Token} from "everpay";
import {UserInfoState} from "../context/UserContext";
import {LoginType, UserStatus} from "../utils/Constants";
import {ethers} from "ethers";
import {Storage} from "../utils/Storage";
import {BalanceItem, EverpayInfo} from "everpay/cjs/types";

let everpayInstance: Everpay | null = null;

interface TipEverpayProps {
    toAccount: string,
    tokenType: string,
    amount: number,
    userInfoState: UserInfoState,
}


export interface EverpayToken {
    tag: string,
    symbol: string,
    decimals: number,
}

export interface EverpayBalance {
    symbol: string,
    balance: string,
}

// region ---- init everpay ----
function initEverpay(userInfoState: UserInfoState): Everpay | null {
    const hasLogin = userInfoState.loginStatus === UserStatus.login && (userInfoState.ethAddress || userInfoState.arAddress);
    if (!hasLogin) {
        return null;
    }

    const loginType = Storage.getItem(Storage.lastLoginType) ?? '';
    if (loginType === LoginType.ar && userInfoState.arAddress) {
        return new Everpay({
            debug: false,
            account: userInfoState.arAddress,
            chainType: ChainType.arweave,
            arJWK: 'use_wallet',
        });
    } else if (userInfoState.ethAddress) { // loginType == eth || walletConnect
        const provider = new ethers.providers.Web3Provider(
            (window as any).ethereum
        );
        const signer = provider.getSigner();
        return new Everpay(
            {
                debug: false,
                account: userInfoState.ethAddress,
                ethConnectedSigner: signer,
            }
        );
    }

    return null;
}

export function removeEverpayInstance() {
    everpayInstance = null;
}

export function tip(props: TipEverpayProps) {
    everpayInstance ??= initEverpay(props.userInfoState);
    if (!everpayInstance) {
        return null;
    }

    return everpayInstance.transfer({
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

export async function loadUserBalance(userInfoState: UserInfoState) {
    everpayInstance ??= initEverpay(userInfoState);
    if (!everpayInstance) {
        return null;
    }

    const symbolSortList = await everpayInstance.info()
        .then((response: EverpayInfo) => response.tokenList.map((k: Token) => k.symbol));

    return await everpayInstance?.balances()
        .then((response: BalanceItem[]) => {
            return response.map((item: BalanceItem) => {
                return {
                    symbol: item.symbol,
                    balance: item.balance,
                } as EverpayBalance;
            });
        }).then((balanceList: EverpayBalance[]) => {
            return balanceList.sort((n1, n2) => {
                const balance1 = parseFloat(n1.balance);
                const balance2 = parseFloat(n2.balance);
                if ((balance1 === 0 && balance2 === 0) || (balance1 !== 0 && balance2 !== 0)) {
                    return symbolSortList.indexOf(n1.symbol) > symbolSortList.indexOf(n2.symbol) ? 1 : -1;
                } else {
                    if (balance1 !== 0) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
            });
        });
}