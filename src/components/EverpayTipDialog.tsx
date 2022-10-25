import {useSnakeBarContext} from "../utils/SnackBar";
import React, {useState} from "react";
import {Storage} from "../utils/Storage";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogTitle, Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField
} from "@mui/material";
import {useUserContext} from "../context/UserContext";
import tip from "./Everpay";
import {UserStatus} from "../utils/Constants";
import {saveEverpayLog} from "../api/ApiService";

export interface EverpayDialogProps {
    open: boolean,
    onClose: (value: string) => void,
    closeDialog: () => void,
    toUsername: string,
    toAddress: string,
}

export function EverpayDialog(props: EverpayDialogProps) {
    const {open, onClose, closeDialog} = props;

    const {snakeBarDispatch} = useSnakeBarContext();
    const {userInfoState, setUserState} = useUserContext();
    const [loading, setLoading] = useState(false);
    const [tokenType, setTokenType] = useState('USDC');
    const [tokenAmount, setTokenAmount] = useState(0);

    const handleClose = () => {
        onClose('');
    }

    const startTipping = async () => {
        setLoading(true);

        const everpayResponse = await tip({
            toAccount: props.toAddress,
            tokenType: tokenType,
            amount: tokenAmount,
            userInfoState: userInfoState,
        });

        if (!everpayResponse) {
            snakeBarDispatch({open: true, message: 'Unknown error, please try later'});
        } else if (everpayResponse['status'] === 'ok') {
            // log to metaforo api.
            closeDialog();
            snakeBarDispatch({open: true, message: 'Tipping Success'});
            saveEverpayLog(everpayResponse);
        } else if (everpayResponse['error']) {
            snakeBarDispatch({open: true, message: everpayResponse['error']});
        } else {
            if (everpayResponse.toString().startsWith('Error')) {
                snakeBarDispatch({open: true, message: everpayResponse.toString()});
            } else {
                snakeBarDispatch({open: true, message: 'Unknown error, please try later'});
            }
        }

        setLoading(false);
    }

    const logout = () => {
        Storage.removeAll();
        setUserState({
            loginStatus: UserStatus.notLogin,
            username: undefined,
            avatar: undefined,
            ethAddress: undefined,
            arAddress: undefined,
        });
    }

    const showWallet = () => {
        window.open('https://metaforo.io/my/wallet', '_blank', 'noopener,noreferrer');
    }

    // region ---- Content ----

    let content;
    if (loading) {
        content = (<div className={'mf-dialog-circle-div'}>
            <CircularProgress/>
        </div>);
    } else {
        content = (<Stack direction={'column'} spacing={2} className={'mf-dialog-padding'}>
            <FormControl>
                <div className={'mf-dialog-item-padding'}>
                    <div className={'mf-position-relative mf-token-info'}>
                        <InputLabel>Token</InputLabel>
                        <Select
                            value={tokenType}
                            label={'Token'}
                            onChange={(event: SelectChangeEvent) => {
                                setTokenType(event.target.value)
                            }}
                        >
                            <MenuItem value={"BNB"}>BNB</MenuItem>
                            <MenuItem value={"DODO"}>DODO</MenuItem>
                            <MenuItem value={"LAT"}>LAT</MenuItem>
                            <MenuItem value={"USDC"}>USDC</MenuItem>
                            <MenuItem value={"XSGD"}>XSGD</MenuItem>
                            <MenuItem value={"AR"}>AR</MenuItem>
                            <MenuItem value={"ETH"}>ETH</MenuItem>
                            <MenuItem value={"GLMR"}>GLMR</MenuItem>
                            <MenuItem value={"CFX"}>CFX</MenuItem>
                            <MenuItem value={"USDT"}>USDT</MenuItem>
                            <MenuItem value={"FOX"}>FOX</MenuItem>
                            <MenuItem value={"ARDRIVE"}>ARDRIVE</MenuItem>
                            <MenuItem value={"SOS"}>SOS</MenuItem>
                            <MenuItem value={"T4EVER"}>T4EVER</MenuItem>
                            <MenuItem value={"WBTC"}>WBTC</MenuItem>
                            <MenuItem value={"ZLK"}>ZLK</MenuItem>
                            <MenuItem value={"BANK"}>BANK</MenuItem>
                            <MenuItem value={"VRT"}>VRT</MenuItem>
                            <MenuItem value={"MASK"}>MASK</MenuItem>
                            <MenuItem value={"UNI"}>UNI</MenuItem>
                            <MenuItem value={"DAI"}>DAI</MenuItem>
                        </Select>
                    </div>

                    <TextField className={'mf-token-amount'} label={'Amount'}
                               onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                   setTokenAmount(parseFloat(event.target.value));
                               }}>0</TextField>

                </div>
            </FormControl>
            <div className={'mf-dialog-item-padding'}>
                <TextField className={'mf-token-address'} label={'Address'} value={props.toAddress}
                           InputProps={{readOnly: true}}/>
            </div>
            <div className={'mf-dialog-item-padding'}>
                <Button className={'mf-button-style-1'} onClick={startTipping}>Tip</Button>
            </div>

            <Divider/>
            <div className={'mf-dialog-item-padding'}>
                <Button className={'mf-button-style-1'} onClick={logout}>Log out</Button>
                <Button className={'mf-button-style-1'} onClick={showWallet}>Show Wallet Address</Button>
            </div>
        </Stack>);
    }

    // endregion ---- Content ----

    return (
        <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={'sm'}>
            <DialogTitle>Tip to {props.toUsername}</DialogTitle>
            {content}
        </Dialog>
    );
}