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
    const [tokenType, setTokenType] = useState('USDC');
    const [tokenAmount, setTokenAmount] = useState(0);
    const [balanceList, setBalanceList] = useState([] as EverpayBalance[]);

    useEffect(() => {
        initEverpayInfo();
        // eslint-disable-next-line
    }, []);

    const handleClose = () => {
        onClose('');
    }

    const initEverpayInfo = async () => {
        setLoading(true);

        const balances = await loadUserBalance(userInfoState);
        if (balances != null) {
            setBalanceList(balances!);
        }

        setLoading(false);
    }

    const startTipping = async () => {
        setLoading(true);

        const everpayResponse = await tip({
            toAccount: tipWidgetState.receiver.address,
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
            saveEverpayLog(everpayResponse, tipWidgetState);
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
                            value={tokenType}
                            label={'Token'}
                            onChange={(event: SelectChangeEvent) => {
                                setTokenType(event.target.value)
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

                    <TextField className={'mf-token-amount'} label={'Amount'}
                               inputProps={{
                                   inputMode: 'numeric',
                                   pattern: '[0-9】*',
                               }}
                               onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                   setTokenAmount(parseFloat(event.target.value));
                               }}>0</TextField>

                </div>
            </FormControl>
            <div className={'mf-dialog-item-padding'}>
                <TextField className={'mf-token-address'} label={'Address'} value={tipWidgetState.receiver.address}
                           InputProps={{readOnly: true}}/>
            </div>
            <div className={'mf-dialog-item-padding'}>
                <Button className={'mf-button-style-1'} onClick={startTipping}>Tip</Button>
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