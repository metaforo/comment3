import axios, {AxiosResponse} from 'axios';
import log from '../utils/LogUtil';
import {Storage} from '../utils/Storage';
import {TipWidgetState} from '../context/TipWidgetContext';
import {camelCase} from 'lodash';
import {convertJsonKey} from '../utils/Util';
import {saveUserInfoToStorage} from '../utils/UserUtil';

export const apiHost = 'https://metaforo.io/api';

// region ---- init instance ----

const instance = axios.create({
    baseURL: apiHost,
    headers: {
        common: {
            'mf-api-key': 'mf-web-sdk',
        },
    },
});

export function initApiService(token: string) {
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
            initApiService(res.data.data.api_token);
        }
        return res.data;
    }
}

function get(path: string, params?: any) {
    return instance
        .get(path, {
            params: params,
        })
        .then(handleResponse);
}

function post(path: string, params?: any) {
    return instance.post(path, params).then(handleResponse);
}

// endregion ---- init instance ----

// region ---- User ----

export type LoginParam = {
    web3_public_key: string;
    // 3 = ar, 5 = eth (metamask or walletconnect)
    wallet_type: number;
    // Only use for arConnect
    web3_address: string | undefined;
    sign: string;
    signMsg: string;
    group_name: string | undefined;
    display_name: string | undefined;
    display_avatar: string | undefined;
};

export function loginByWallet(param: LoginParam) {
    return post('/wallet/sso', param).then((res) => {
        if (res.data && res.data.user) {
            saveUserInfoToStorage(res.data.user, param.group_name);
        }
        return res.data;
    });
}

export function refreshLoginStatus(groupName: string) {
    return get('/me').then((res) => {
        log('get current user ' + res.data + ' , ' + res.data.user);
        if (res.data && res.data.user) {
            saveUserInfoToStorage(res.data.user, groupName);
        }
        return res;
    });
}

export type UpdateProfileParam = {
    display_name: string | undefined;
    group_name: string | undefined;
    display_avatar: string | undefined;
    is_nft: number | undefined;
};

export function updateProfile(param: UpdateProfileParam) {
    return post('/user/update_info', param).then((res) => {
        if (res.data && res.data.username) {
            saveUserInfoToStorage(res.data, param.group_name);
        }
        return res;
    });
}

export function loadNftAvatar(address: string) {
    return axios
        .get(`https://api.opensea.io/api/v1/assets?limit=100&owner=${address}`)
        .then((res) => {
            return res.data;
        })
        .then((res) => {
            if (!res.assets) {
                return [];
            }

            const result: any[] = [];
            (res.assets as []).forEach((asset) => {
                if (asset['image_preview_url']) {
                    result.push(asset['image_preview_url']);
                }
            });
            return result;
        })
        .catch(() => {
            return [];
        });
}

// endregion ---- User ----

// region ---- Comment ----

export function loadThread(groupName: string, thread: string, startPostId: number) {
    const url = '/get_thread/0';
    return get(url, {
        sort: 'new',
        page_size: 10,
        start_post_id: startPostId,
        group_name: groupName,
        web_thread_name: thread,
    }).then((res) => {
        return convertJsonKey(
            res.data,
            (k: string) => {
                if (k === 'total_likes') {
                    return 'likeCount';
                }
                return k;
            },
            camelCase,
        );
    });
}

export function loadInnerComment(groupName: string, parentPostId: number, startPostId: number) {
    const url = '/get_comment';
    return get(url, {
        group_name: groupName,
        page_size: 5,
        parent_post_id: parentPostId,
        start_post_id: startPostId,
        sort: 'new',
    }).then((res) => {
        return convertJsonKey(
            res.data,
            (k: string) => {
                if (k === 'total_likes') {
                    return 'likeCount';
                }
                return k;
            },
            camelCase,
        );
    });
}

export function submitPost(groupName: string, thread: string, content: any, replyId?: number) {
    const url = '/submit_post';
    return post(url, {
        group_name: groupName,
        web_thread_name: thread,
        content: content,
        reply_id: replyId && replyId > 0 ? replyId : undefined,
    }).then((res) => {
        return convertJsonKey(res, camelCase);
    });
}

export function likePost(groupName: string, postId: number) {
    const url = '/like_post';
    return post(url, {
        group_name: groupName,
        post_id: postId,
    }).then((res) => {
        return res;
    });
}

export function unlikePost(groupName: string, postId: number) {
    const url = '/unlike_post';
    return post(url, {
        group_name: groupName,
        post_id: postId,
    }).then((res) => {
        return res;
    });
}

// endregion ---- Comment ----

// region ---- Like ----

export function getLikeInfo(groupName: string, thread: string) {
    const url = '/websdk/like/list';
    return get(url, {
        group_name: groupName,
        web_thread_name: thread,
    }).then((res) => {
        return convertJsonKey(res, camelCase);
    });
}

export function likeThread(groupName: string, thread: string) {
    const url = '/websdk/thread/like';
    return post(url, {
        group_name: groupName,
        web_thread_name: thread,
    }).then((res) => {
        return res;
    });
}

export function unlikeThread(groupName: string, thread: string) {
    const url = '/websdk/thread/unlike';
    return post(url, {
        group_name: groupName,
        web_thread_name: thread,
    }).then((res) => {
        return res;
    });
}

// endregion ---- Like ----

// region ---- Tipping ----

export function saveEverpayLog(everpayResponse: any, tipWidgetState: TipWidgetState, amount: string) {
    return post('/everpay/init', {
        hash: everpayResponse.everHash,
        symbol: everpayResponse.everpayTx.tokenSymbol,
        from: everpayResponse.everpayTx.from,
        to: everpayResponse.everpayTx.to,
        amount: amount, // everpay.everpayTx.amount should divide by decimal.
        chain_type: everpayResponse.everpayTx.chainType,
        token_id: everpayResponse.everpayTx.tokenID,
        group_name: tipWidgetState.siteName,
        post_id: tipWidgetState.pageId,
    });
}

// endregion ---- Tipping ----
