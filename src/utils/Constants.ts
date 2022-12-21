export const LIB_VER = '0.4.7';

export class UserStatus {
    static readonly isChecking = 0;
    static readonly login = 1;
    static readonly notLogin = 2;
}

export class LoginType {
    static readonly eth = 'eth';
    static readonly ar = 'ar';
    static readonly walletConnect = 'wc';
}
