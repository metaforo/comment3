import {Web3Provider} from '@ethersproject/providers/src.ts/web3-provider';
import {ethers} from 'ethers';
// @ts-ignore
const {ethereum} = window;
let provider: Web3Provider | undefined;
if (ethereum) {
    provider = new ethers.providers.Web3Provider(ethereum);
}

export async function getEns(addr: string) {
    if (!provider) {
        return null;
    }
    return await provider.lookupAddress(addr).catch(() => {
        return null;
    });
}

export async function getAddress(ensName: string) {
    if (!provider) {
        return null;
    }

    return await provider.resolveName(ensName).catch(() => {
        return null;
    });
}
