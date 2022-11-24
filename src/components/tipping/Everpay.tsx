import Everpay, {ChainType, Token} from 'everpay';
import {UserInfoState} from '../../context/UserContext';
import {LoginType, UserStatus} from '../../utils/Constants';
import {ethers} from 'ethers';
import {Storage} from '../../utils/Storage';
import {BalanceItem, EverpayInfo} from 'everpay/cjs/types';

let everpayInstance: Everpay | null = null;

interface TipEverpayProps {
    toAccount: string;
    tokenType: string;
    amount: number;
    userInfoState: UserInfoState;
}

export interface EverpayBalance {
    symbol: string;
    balance: number;
    decimals: number;
    tag: string;
}

// region ---- init everpay ----
function initEverpay(userInfoState: UserInfoState): Everpay | null {
    const hasLogin =
        userInfoState.loginStatus === UserStatus.login && (userInfoState.ethAddress || userInfoState.arAddress);
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
    } else if (userInfoState.ethAddress) {
        // loginType == eth || walletConnect
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const signer = provider.getSigner();
        return new Everpay({
            debug: false,
            account: userInfoState.ethAddress,
            ethConnectedSigner: signer,
        });
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

    return everpayInstance
        .transfer({
            to: props.toAccount,
            symbol: props.tokenType,
            amount: props.amount.toString(),
            data: {
                platform: 'metaforo-sdk',
            },
        })
        .then((response: any) => {
            return response;
        })
        .catch((error: any) => {
            return error;
        });
}

export async function loadUserBalance(userInfoState: UserInfoState) {
    everpayInstance ??= initEverpay(userInfoState);
    if (!everpayInstance) {
        return null;
    }

    const tokenList = await everpayInstance.info().then((response: EverpayInfo) => response.tokenList);

    return await everpayInstance
        ?.balances()
        .then((response: BalanceItem[]) => {
            const balanceMap = response.reduce((map: any, item: BalanceItem) => {
                map[item.symbol] = item.balance;
                return map;
            }, {});
            return tokenList.map((token: Token) => {
                let balance = 0;
                if (balanceMap[token.symbol]) {
                    balance = parseFloat(balanceMap[token.symbol]);
                }
                return {
                    balance: balance,
                    decimals: token.decimals,
                    symbol: token.symbol,
                    tag: token.tag,
                } as EverpayBalance;
            });
        })
        .then((balanceList: EverpayBalance[]) => {
            return balanceList.sort((n1, n2) => {
                if ((n1.balance === 0 && n2.balance === 0) || (n1.balance !== 0 && n2.balance !== 0)) {
                    return 0;
                } else {
                    if (n1.balance !== 0) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
            });
        });
}
