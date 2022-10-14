const prefix = 'mf-';

export class Storage {
    static readonly userToken = prefix + 'user-token';
    static readonly userName = prefix + 'username';
    static readonly userAvatar = prefix + 'avatar';

    static saveItem(key: string, value: string) {
        return localStorage.setItem(key, value);
    }

    static getItem(key: string) {
        return localStorage.getItem(key);
    }

    static removeItem(key: string) {
        return localStorage.removeItem(key);
    }
}

