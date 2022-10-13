import {useSnakeBarContext} from "../utils/SnackBar";
import React, {useState} from "react";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
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
    const {userInfoState} = useUserContext();
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
            // TODO: 发送后端请求，记录 tip 结果
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

    // region ---- Content ----

    let content;
    if (loading) {
        content = (<CircularProgress/>);
    } else {
        content = (<Stack direction={'column'} spacing={2}>
            <FormControl>
                <Stack direction={'row'}>
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
                    <TextField label={'Amount'} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setTokenAmount(parseFloat(event.target.value));
                    }}>0</TextField>
                </Stack>
            </FormControl>
            <TextField label={'Address'} value={props.toAddress} InputProps={{readOnly: true}}/>
            <Button onClick={startTipping}>Tip</Button>
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