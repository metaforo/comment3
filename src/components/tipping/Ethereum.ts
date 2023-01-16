import {UserInfoState} from '../../context/UserContext';
import log from '../../utils/LogUtil';
import Web3 from 'web3';
import {BaseTippingChannel} from '../../model/tipping/BaseTippingChannel';
import {BaseToken} from '../../model/tipping/BaseToken';
import {UserStatus} from '../../utils/Constants';

export class EthToken extends BaseToken {
    name: string;
    iconUrl: string;
    decimal: number;
    balance: number;

    isMain: boolean;
    address: string;
    abi: string;
}

export class EthTippingChannel extends BaseTippingChannel {
    constructor() {
        super();
        this.name = 'Ethereum';
        this.iconUrl = 'https://cdn.metaforo.io/images/token/eth_thumb.png';
    }

    async loadUserBalance(userInfoState: UserInfoState): Promise<EthToken[]> {
        const hasLogin = userInfoState.loginStatus === UserStatus.login && userInfoState.ethAddress;
        if (!hasLogin) {
            return null;
        }

        const config = await loadUserEthBalance(userInfoState);
        log(config);
        return config;
    };

    startTipping(): Promise<void> {
        return Promise.resolve(undefined);
    }
}

export async function loadUserEthBalance(userInfoState: UserInfoState) {
    const provider = (window as any).ethereum;
    if (!provider) {
        log('missing metamask');
        return [];
    }

    const configList = await fetch('https://cdn.metaforo.io/json/sdk-tipping-list.json')
        .then((response) => response.json())
        .then((json) => json as EthToken[]);

    const ethAddress = userInfoState.ethAddress;
    // const tokenBalanceMap = {};
    await Promise.all(configList.map(async (config) => {
        if (config.isMain) {
            config.balance = await loadEthBalance(provider, ethAddress);
        } else {
            config.balance = await loadBalance(provider, ethAddress, config);
        }
    }));

    return configList;
}

async function loadEthBalance(provider: any, currentAddress: string) {
    const web3 = new Web3(provider);
    return await provider.request({
        method: 'eth_getBalance',
        params: [currentAddress, 'latest'],
    })
        .then((result) => {
            return web3.utils.fromWei(result, 'ether');
        });
}

async function loadBalance(provider: any, currentAddress: string, tokenConfig: EthToken) {
    const web3 = new Web3(provider);
    const contractAbi = JSON.parse(tokenConfig.abi);
    const contractAddress = tokenConfig.address;
    const myContract = new web3.eth.Contract(contractAbi, contractAddress);
    return await myContract.methods.balanceOf(currentAddress).call(
        {from: currentAddress},
        (error, wei) => {
            return wei / Math.pow(10, tokenConfig.decimal);
        },
    );
}

export function ethTipping(currentAddress: string) {
    const provider = (window as any).ethereum;
    if (!provider) {
        log('missing metamask');
        return;
    }

    provider.request({
        method: 'eth_sendTransaction',
        params: [],
    }).then((txHash) => {
        const info = {
            everHash: txHash,
            from: currentAddress,
            to: '',
            tokenSymbol: 'symbol',
            tokenId: 'address',
        };
    });
}