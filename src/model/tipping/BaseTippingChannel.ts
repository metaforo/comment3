import {BaseToken} from './BaseToken';
import {UserInfoState} from '../../context/UserContext';

export abstract class BaseTippingChannel {
    name: string;
    iconUrl: string;
    tokenList: BaseToken[];

    abstract loadUserBalance(userInfoState: UserInfoState): Promise<BaseToken[]>;

    abstract startTipping(): Promise<void>;
}

