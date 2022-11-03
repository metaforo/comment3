import React from "react";
import {camelCase} from "lodash";
import {DeltaStatic} from "quill";

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

export function floatToString(num: number, decimal: number) {
    return num.toLocaleString('fullwide', {
        useGrouping: false,
        maximumFractionDigits: decimal,
    },);
}

// region ---- Container ----

export function composeProviders(...providers: any) {
    return ({children}: { children: JSX.Element }) => providers.reduce(
        (prev: any, Provider: any) => <Provider>{prev}</Provider>,
        children,
    );
}


// endregion ---- Container ----

export function getPureContent(content: string) {
    let result = '';
    const quill = JSON.parse(content);
    quill.forEach((item: any) => {
        result += item['insert'];
    })
    return result;
}

export function convertJsonKey(obj: any, ...keyTransformers: ((value: string) => string)[]): any {
    if (Array.isArray(obj)) {
        return obj.map(v => convertJsonKey(v, ...keyTransformers));
    } else if (obj != null && obj.constructor === Object) {
        return Object.keys(obj).reduce(
            (result, key) => ({
                ...result,
                [keyTransformers.reduce((key: string, func: (value: string) => string) => func(key), key)]: convertJsonKey(obj[key], ...keyTransformers),
            }),
            {},
        );
    }
    return obj;
}

export function convertJsonKeyToCamel(json: any, ...keyTransformers: ((value: string) => string)[]) {
    return convertJsonKey(json, ...keyTransformers, camelCase);
}

export function serverDateToString(dateStr: string) {
    const timestamp = Date.parse(dateStr);
    if (isNaN(timestamp)) {
        return '';
    }

    const datetime = new Date(timestamp);
    const now = new Date();
    // @ts-ignore
    const diff = Math.floor((now - datetime) / 1000);

    if (diff >= 86400 || diff < 0) {
        return datetime.toLocaleDateString();
    }

    if (diff < 60) {
        return "just now";
    } else if (diff < 3600) {
        const minute = Math.floor(diff / 60);
        return minute === 1 ? '1 minute ago' : minute + ' minutes ago';
    } else {
        const hour = Math.floor(diff / 3600);
        return hour === 1 ? '1 hour ago' : hour + ' hours ago';
    }
}

export const EMPTY_DELTA = () => {
    return {ops: []} as unknown as DeltaStatic;
};