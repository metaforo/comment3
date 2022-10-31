import {useSnakeBarContext} from "../utils/SnackBar";
import React, {useEffect, useState} from "react";
import {Storage} from "../utils/Storage";
import {
    Avatar,
    Button,
    Dialog,
    FormControl,
    IconButton,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    SxProps,
    TextField,
    Theme
} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {useUserContext} from "../context/UserContext";
import {EverpayBalance, loadUserBalance, removeEverpayInstance, tip} from "./Everpay";
import {UserStatus} from "../utils/Constants";
import {saveEverpayLog} from "../api/ApiService";
import {useTipWidgetContext} from "../context/TipWidgetContext";
import {Global} from "../utils/GlobalVariables";
import {floatToString} from "../utils/Util";
import {CloseableDialogTitle} from "./CloseableDialogTitle";
import {grey} from "@mui/material/colors";
import LoadingWidget from "./LoadingWidget";

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

    const onAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

        setTokenAmount(floatToString(val, selectedBalance.decimals));
    }

    // region ---- Content ----

    const textButtonStyle = {
        fontSize: '14px',
        color: grey['600'],
        textTransform: 'none',
        marginTop: '9px',
    };

    const avatarSxProps: SxProps<Theme> = {width: 20, height: 20, mr: '12px'};
    const menuItems = balanceList.map((balance) => {
        return (<MenuItem key={balance.symbol} value={balance.symbol}>
            <div className='mf-balance-menu-item'>
                <Avatar alt={balance.symbol}
                        src={'https://cdn.metaforo.io/images/token/' + balance.symbol.toLowerCase() + '_thumb.png'}
                        sx={avatarSxProps}
                />
                <p style={{flexGrow: 1,}}>{balance.symbol}</p>
                <p>{floatToString(balance.balance, balance.decimals)}</p>
            </div>
        </MenuItem>);
    });

    let content = (
        <Stack direction={'column'} spacing={2} className={'mf-dialog-padding'}
               sx={{
                   visibility: loading ? 'hidden' : 'visible',
               }}
        >
            <FormControl>
                <div className={'mf-dialog-main'}>
                    <div className={'mf-dialog-tip-address'}>
                        <div className={'mf-dialog-address-text'} style={{color: grey['600']}}>
                            {tipWidgetState.receiver.address}
                        </div>
                        <IconButton
                            aria-label="copy-address"
                            className={'mf-dialog-address-icon'}
                            size={"small"}
                            sx={{
                                color: (theme) => theme.palette.grey[500],
                                fontSize: '14px'
                            }}
                        >
                            <ContentCopyIcon/>
                        </IconButton>
                    </div>

                    <div className={'mf-dialog-select-main'}>
                        <div className={'mf-dialog-select'}>
                            <Select
                                value={selectedBalance.symbol}
                                onChange={(event: SelectChangeEvent) => {
                                    balanceList.forEach((b) => {
                                        if (b.symbol === event.target.value) {
                                            setSelectedBalance(b);
                                            setTokenAmount('0');
                                        }
                                    })
                                }}
                                renderValue={(selected) => (
                                    <div className='mf-balance-select-item'>
                                        <Avatar alt={selected}
                                                src={'https://cdn.metaforo.io/images/token/' + selected.toLowerCase() + '_thumb.png'}
                                                sx={avatarSxProps}
                                        />
                                        <p>{selected}</p>
                                    </div>
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
                        <div className={'mf-dialog-input'}>
                            <TextField id="demo-helper-text-misaligned-no-helper"
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
                                       onChange={onAmountChange}
                            />
                        </div>
                    </div>

                    <div className={'mf-dialog-bottom'}>
                        <div className={'mf-dialog-balance-info'} style={{color: grey['600']}}>
                            Balance:
                            <span className={'mf-dialog-bottom-balance'}>
                                {floatToString(selectedBalance.balance, selectedBalance.decimals)}
                            </span>
                            <span className={'mf-dialog-bottom-text'} style={{color: grey['600']}}>
                                {selectedBalance.symbol}
                            </span>
                        </div>
                        <div className={'mf-dialog-bottom-link'}>
                            <Button
                                variant={"text"}
                                sx={textButtonStyle}
                                onClick={logout}
                            >
                                Log Out
                            </Button>
                            <Button
                                variant={"text"}
                                sx={textButtonStyle}
                                onClick={showWallet}
                            >
                                Transaction History
                            </Button>
                        </div>

                    </div>
                    <Button
                        onClick={startTipping}
                        variant={"contained"}
                        sx={{
                            borderRadius: '100px',
                            width: '120px',
                            height: '44px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            marginTop: '40px',
                            marginBottom: '20px',
                        }}
                    >
                        Tip
                    </Button>
                </div>
            </FormControl>
        </Stack>);

    // endregion ---- Content ----

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth={true}
            maxWidth={'sm'}>
            <CloseableDialogTitle onClose={handleClose}>
                {<p> Tip to {tipWidgetState.receiver.username}</p>}
            </CloseableDialogTitle>
            {content}
            <LoadingWidget loading={loading}/>
        </Dialog>
    );
}