import {useSnakeBarContext} from "../utils/SnackBar";
import React, {useEffect, useState} from "react";
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
import {tip, removeEverpayInstance, loadUserBalance, EverpayBalance} from "./Everpay";
import {UserStatus} from "../utils/Constants";
import {saveEverpayLog} from "../api/ApiService";
import {useTipWidgetContext} from "../context/TipWidgetContext";
import {Global} from "../utils/GlobalVariables";

export interface EverpayDialogProps {
    open: boolean,
    onClose: (value: string) => void,
    closeDialog: () => void,
}

export function EverpayDialog(props: EverpayDialogProps) {
    const {open, onClose, closeDialog} = props;

    const {snakeBarDispatch} = useSnakeBarContext();
    const {userInfoState, setUserState} = useUserContext();
    const {tipWidgetState} = useTipWidgetContext();
    const [loading, setLoading] = useState(false);
    const [tokenAmount, setTokenAmount] = useState('0');
    const [selectedBalance, setSelectedBalance] = useState({
        symbol: '',
        balance: 0,
    } as EverpayBalance);
    const [balanceList, setBalanceList] = useState([] as EverpayBalance[]);

    useEffect(() => {
        initEverpayInfo();
        // eslint-disable-next-line
    }, []);

    const handleClose = () => {
        onClose('');
    }

    const initEverpayInfo = () => {
        setLoading(true);

        loadUserBalance(userInfoState)
            .then((balances) => {
                if (balances != null) {
                    setBalanceList(balances!);
                    setSelectedBalance(balances[0]);
                }
                setLoading(false);
            });
    }

    const startTipping = async () => {

        if (!Global.isDemo && parseFloat(tokenAmount) === 0) {
            snakeBarDispatch({open: true, message: 'Tipping amount must larger than 0'});
            return;
        }

        setLoading(true);

        const everpayResponse = await tip({
            toAccount: tipWidgetState.receiver.address,
            tokenType: selectedBalance.symbol,
            amount: parseFloat(tokenAmount),
            userInfoState: userInfoState,
        });

        if (!everpayResponse) {
            snakeBarDispatch({open: true, message: 'Unknown error, please try later'});
        } else if (everpayResponse['status'] === 'ok') {
            // log to metaforo api.
            closeDialog();
            snakeBarDispatch({open: true, message: 'Tipping Success'});
            // no need wait for log api.
            // noinspection ES6MissingAwait
            saveEverpayLog(everpayResponse, tipWidgetState, parseFloat(tokenAmount).toString(),);
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
        removeEverpayInstance();
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

        const menuItems = balanceList.map((balance) => {
            return (<MenuItem key={balance.symbol} value={balance.symbol}>
                <div className='mf-balance-menu-item'>
                    <p>{balance.symbol}</p>
                    <p>{balance.balance}</p>
                </div>
            </MenuItem>);
        });

        content = (<Stack direction={'column'} spacing={2} className={'mf-dialog-padding'}>
            <FormControl>
                <div className={'mf-dialog-item-padding'}>
                    <div className={'mf-position-relative mf-token-info'}>
                        <InputLabel>Token</InputLabel>
                        <Select
                            value={selectedBalance.symbol}
                            label={'Token'}
                            onChange={(event: SelectChangeEvent) => {
                                balanceList.forEach((b) => {
                                    if (b.symbol === event.target.value) {
                                        setSelectedBalance(b);
                                        setTokenAmount('0');
                                    }
                                })
                            }}
                            renderValue={(selected) => (
                                <>{selected}</>
                            )}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 520,
                                    }
                                }
                            }}
                        >
                            {menuItems}
                        </Select>
                    </div>

                    <TextField className={'mf-token-amount'}
                               label={'Amount (You have ' + selectedBalance.balance + ' ' + selectedBalance.symbol + ')'}
                               inputProps={{
                                   max: selectedBalance.balance,
                                   min: 0,
                                   inputMode: 'numeric',
                               }}
                               value={tokenAmount}
                               onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
                                   if (event.target.value.length === 0) {
                                       setTokenAmount('0');
                                   }
                               }}
                               onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                   if (!/^([0-9]*[.])?[0-9]*$/.test(event.target.value)) {
                                       return;
                                   }
                                   const pointIndex = event.target.value.indexOf('.');
                                   if (pointIndex >= 0) {
                                       const fractionDigits = event.target.value.length - 1 - pointIndex;
                                       if (fractionDigits === 0) {
                                           // The user has entered a decimal point and needs to wait for the decimal part to be entered
                                           setTokenAmount(event.target.value);
                                           return;
                                       } else {
                                           if (fractionDigits > selectedBalance.decimals) {
                                               return;
                                           }
                                       }
                                   }

                                   let val = parseFloat(event.target.value);
                                   if (isNaN(val)) {
                                       val = 0;
                                   } else if (val > selectedBalance.balance) {
                                       val = selectedBalance.balance;
                                   } else if (val < 0) {
                                       val = 0;
                                   } else {
                                       // this is a special case for 0.000
                                       setTokenAmount(event.target.value);
                                       return;
                                   }

                                   setTokenAmount(val.toString());
                               }}
                    />

                </div>
            </FormControl>
            <div className={'mf-dialog-item-padding'}>
                <TextField className={'mf-token-address'} label={'Address'} value={tipWidgetState.receiver.address}
                           InputProps={{readOnly: true}}/>
            </div>
            <div className={'mf-dialog-item-padding'}>
                <Button className={'mf-tipping-button mf-match-parent-width'} onClick={startTipping}>Tip</Button>
            </div>

            <Divider/>
            <div className={'mf-dialog-item-padding'}>
                <Button className={'mf-button-style-1'} onClick={logout}>Log out</Button>
                <Button className={'mf-button-style-1'} onClick={showWallet}>Show Transaction History</Button>
            </div>
        </Stack>);
    }

    // endregion ---- Content ----

    return (
        <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={'sm'}>
            <DialogTitle>Tip to {tipWidgetState.receiver.username}</DialogTitle>
            {content}
        </Dialog>
    );
}