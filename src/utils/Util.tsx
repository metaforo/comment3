export function typedData(address: string) {
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

export const isMetamaskInstalled = () => {
    // @ts-ignore
    const {ethereum} = window;
    return Boolean(ethereum && ethereum.isMetaMask);
}

export const isArConnectInstalled = () => {
    // @ts-ignore
    const {arweaveWallet} = window;
    return Boolean(arweaveWallet);
}