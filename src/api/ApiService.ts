import axios, {AxiosResponse} from "axios";
import log from "../utils/LogUtil";
import {Storage} from "../utils/Storage";

const apiHost = 'https://test-chao.metaforo.io/api';

// region ---- init instance ----

let instance = axios.create({
    baseURL: apiHost,
    headers: {
        common: {
            'mf-api-key': 'mf-sdk',
        }
    },
})

export function initStatus(token: string) {
    if (token) {
        instance.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }
}

function handleResponse(res: AxiosResponse) {
    if (res.status !== 200) {
        log(res);
    } else {
        if (res.data.data && res.data.data.api_token) {
            log('---- response start ----');
            log(res.data.data);
            log(res.data.data.api_token);
            log('---- response end ----');
            Storage.saveItem(Storage.userToken, res.data.data.api_token);
            initStatus(res.data.data.api_token);
        }
        return res.data;
    }
}

function get(path: string, params?: any) {
    return instance.get(path, {
        params: params,
    }).then(handleResponse);
}

function post(path: string, params?: any) {
    return instance.post(path, params).then(handleResponse);
}

// endregion ---- init instance ----

export function loadComment(groupName: string, thread: string) {
    const url = '/api_thread/' + thread;
    return get(url,
        {
            sort: 'new',
            page_size: 10,
            start_post_id: 0,
            group_name: groupName,
        },
    )
        .then(res => {
            return res.data;
        });
}

export function loginToEth(account: string, sign: string, signMsg: string) {
    return post('/wallet/sso',
        {
            web3_public_key: account,
            wallet_type: 5,
            sign: sign,
            signMsg: signMsg,
        }
    ).then(res => {
        if (res.data && res.data.user) {
            saveUserInfoToStorage(res.data.user);
        }
        return res.data;
    });
}

export function loginToAr(account: string, publicKey: string, sign: string, signMsg: string) {
    return post('/wallet/sso',
        {
            web3_public_key: account,
            web3_address: publicKey,
            wallet_type: 3,
            sign: sign,
            signMsg: signMsg,
        }
    ).then(res => {
        if (res.data && res.data.user) {
            saveUserInfoToStorage(res.data.user);
        }
        return res.data;
    });
}

export function saveEverpayLog(everpayResponse: any) {
    return post('/everpay/init', {
        'hash': everpayResponse.everHash,
        'symbol': everpayResponse.everpayTx.tokenSymbol,
        'from': everpayResponse.everpayTx.from,
        'to': everpayResponse.everpayTx.to,
        'amount': everpayResponse.everpayTx.amount,
        'chain_type': everpayResponse.everpayTx.chainType,
        'token_id': everpayResponse.everpayTx.tokenID,
        'group_name': 'MetaforoOfficialDiscussionGroup',
        'post_id': '0',
    }).then(res => {
        // console.log(res);
        // do nothing.
    });
}

export function getCurrentUser() {
    return get('/me').then(res => {
        log('get current user ' + res.data + ' , ' + res.data.user);
        if (res.data && res.data.user) {
            saveUserInfoToStorage(res.data.user);
        }
        return res.data;
    });
}

function saveUserInfoToStorage(user: any) {
    Storage.saveItem(Storage.userName, user.username);
    Storage.saveItem(Storage.userAvatar, user.photo_url);
    user.web3_public_keys.forEach((web3Key: any) => {
        switch (web3Key.type) {
            case 5:
                Storage.saveItem(Storage.userEthAddress, web3Key.address);
                break;
            case 3:
                Storage.saveItem(Storage.userArAddress, web3Key.address);
                break;
            default:
                // do nothing.
                break;
        }
    });
}