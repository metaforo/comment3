const prefix = 'mf-';

export class Storage {
    static readonly isLogin = prefix + 'is-login';
    static readonly userToken = prefix + 'user-token';
    static readonly userName = prefix + 'username';
    static readonly displayName = prefix + 'display-name';
    static readonly userAvatar = prefix + 'avatar';
    static readonly userEthAddress = prefix + 'eth-address';
    static readonly userArAddress = prefix + 'ar-address';
    // should be eth / ar / wc
    static readonly lastLoginType = prefix + 'login-type';

    static saveItem(key: string, value: string) {
        const result = localStorage.setItem(key, value);
        window.dispatchEvent(
            new CustomEvent<EventItem>(StorageEvent, {
                detail: {
                    type: EventTypeSave,
                    key: key,
                    value: value,
                } as EventItem,
            }),
        );
        return result;
    }

    static getItem(key: string) {
        return localStorage.getItem(key);
    }

    static removeItem(key: string) {
        const result = localStorage.removeItem(key);
        window.dispatchEvent(
            new CustomEvent<EventItem>(StorageEvent, {
                detail: {
                    type: EventTypeRemove,
                    key: key,
                    value: null,
                } as EventItem,
            }),
        );
        return result;
    }

    static removeAll() {
        const result = localStorage.clear();
        window.dispatchEvent(
            new CustomEvent<EventItem>(StorageEvent, {
                detail: {
                    type: EventTypeRemoveAll,
                    key: '',
                    value: null,
                } as EventItem,
            }),
        );
        return result;
    }
}

export const StorageEvent = 'MfStorageEvent';
export const EventTypeSave = 'save';
export const EventTypeRemove = 'remove';
export const EventTypeRemoveAll = 'remove_all';

export interface EventItem {
    // save, remove, remove_all
    type: string;
    key: string;
    value: any;
}
