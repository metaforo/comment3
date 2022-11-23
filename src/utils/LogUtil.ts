import {Global} from './GlobalVariables';

export default function log(message?: any, ...optionalParams: any[]) {
    if (Global.isDebug) {
        if (optionalParams && optionalParams.length === 0) {
            console.log(message);
        } else {
            console.log(message, optionalParams);
        }
    }
}
