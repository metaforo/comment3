const prefix = 'mf-';

export class Storage {
    static readonly userToken = prefix + 'user-token';
    static readonly userName = prefix + 'username';
    static readonly userAvatar = prefix + 'avatar';
    static readonly userEthAddress = prefix + 'eth-address';
    static readonly userArAddress = prefix + 'ar-address';
    // should be eth / ar / wc
    static readonly lastLoginType = prefix + 'login-type';

    static saveItem(key: string, value: string) {
        return localStorage.setItem(key, value);
    }

    static getItem(key: string) {
        return localStorage.getItem(key);
    }

    static removeItem(key: string) {
        return localStorage.removeItem(key);
    }

    static removeAll() {
        return localStorage.clear();
    }
}

