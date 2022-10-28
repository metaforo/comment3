import {
    Avatar,
    CircularProgress,
    Dialog,
    DialogTitle,
    List,
    ListItemButton,
    ListItemText,
    SxProps,
    Theme
} from "@mui/material";
import {connectToAr} from "./ArconnectLogin";
import {isArConnectInstalled, isMetamaskInstalled} from "../utils/Util";
import {loginIconSize} from "../utils/ThemeUtil";
import {useSnakeBarContext} from "../utils/SnackBar";
import {useUserContext} from "../context/UserContext";
import {useState} from "react";
import {connectToMetamask} from "./MetamaskLogin";
import {connectToWalletconnect} from "./WalletconnectLogin";

export interface LoginDialogProps {
    open: boolean,
    onClose: (value: string) => void;
    closeDialog: () => void;
}

export function LoginDialog(props: LoginDialogProps) {
    const {open, onClose, closeDialog} = props;
    let selectedValue = '';

    const {snakeBarDispatch} = useSnakeBarContext();
    const {setUserState} = useUserContext();
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        onClose(selectedValue);
    }

    // region ---- ArConnect ----
    const startArConnect = async () => {
        if (!isArConnectInstalled()) {
            snakeBarDispatch({open: true, message: 'You haven\'t install ArConnect plugin yet.'});
            return;
        }
        setLoading(true);

        await connectToAr(setUserState);

        closeDialog();
        setLoading(false);
    }
    // endregion ---- ArConnect ----

    const startMetamaskConnect = async () => {
        if (!isMetamaskInstalled()) {
            snakeBarDispatch({open: true, message: 'You haven\'t install Metamask plugin yet.'});
            return;
        }

        setLoading(true);

        await connectToMetamask(setUserState);

        closeDialog();
        setLoading(false);
    }

    const startWalletconnect = async () => {
        setLoading(true);

        await connectToWalletconnect(setUserState);

        closeDialog();
        setLoading(false);
    }

    const avatarSxProps: SxProps<Theme> = {width: loginIconSize, height: loginIconSize, mr: '10px'};

    let content;
    if (loading) {
        content = (
            <div className={'mf-dialog-circle-div'}>
            <CircularProgress/>
            </div>
        );
    } else {
        content = (<List>
            {/* ArConnect */}
            <ListItemButton onClick={startArConnect}>
                <Avatar alt={'ArConnect'}
                        src={'https://cdn.metaforo.io/images/connect/ar_thumb.png'}
                        sx={avatarSxProps}
                />
                <ListItemText primary={'ArConnect'}/>
            </ListItemButton>
            {/* Metamask */}
            <ListItemButton onClick={startMetamaskConnect}>
                <Avatar alt={'Metamask'}
                        src={'https://cdn.metaforo.io/images/connect/metamask_thumb.png'}
                        sx={avatarSxProps}
                />
                <ListItemText primary={'Metamask'}/>
            </ListItemButton>
            {/* WalletConnect */}
            <ListItemButton onClick={startWalletconnect}>
                <Avatar alt={'WalletConnect'}
                        src={'https://cdn.metaforo.io/images/connect/wc_thumb.png'}
                        sx={avatarSxProps}
                />
                <ListItemText primary={'WalletConnect'}/>
            </ListItemButton>
        </List>);
    }
    return (
        <Dialog
            onClose={handleClose}
            open={open}
            maxWidth={"sm"}
            fullWidth={true}>
            <DialogTitle>Connect Wallet</DialogTitle>
            {content}
        </Dialog>
    );
}
