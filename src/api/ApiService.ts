import axios, {AxiosResponse} from "axios";
import {Storage} from "../utils/Storage";

const apiHost = 'https://test-chao.metaforo.io/api';

// region ---- init instance ----

let instance = axios.create({
    baseURL: apiHost,
    headers: {
        common: {
            'mf-api-key': 'metaqus',
        }
    },
})

export function initStatus(token: string) {
    console.log(instance.defaults);
    if (token) {
        instance.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }
}

function handleResponse(res: AxiosResponse) {
    if (res.status !== 200) {
        console.log(res);
    } else {
        if (res.data.data && res.data.data.api_token) {
            console.log('---- response start ----');
            console.log(res.data.data);
            console.log(res.data.data.api_token);
            console.log('---- response end ----');
            Storage.saveItem(Storage.userToken, res.data.data.api_token);
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
    console.log(params);
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

export function login(account: string, sign: string, signMsg: string) {
    return post('/wallet/login',
        {
            web3_public_key: account,
            wallet_type: 5,
            sign: sign,
            signMsg: signMsg,
        }
    ).then(res => {
        if (res.data && res.data.user) {
            Storage.saveItem(Storage.userName, res.data.user.user);
            Storage.saveItem(Storage.userAvatar, res.data.user.photo_url);
        }
        return res.data;
    });
}

export function getCurrentUser() {
    return get('/me').then(res => {
        console.log('get current user ' + res.data + ' , ' + res.data.user);
        if (res.data && res.data.user) {
            Storage.saveItem(Storage.userName, res.data.user.user);
            Storage.saveItem(Storage.userAvatar, res.data.user.photo_url);
        }
        return res.data;
    });
}