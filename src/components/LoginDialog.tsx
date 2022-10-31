import {Avatar, Dialog, List, ListItemButton, ListItemText, SxProps, Theme, Tooltip} from "@mui/material";
import {connectToAr} from "./ArconnectLogin";
import {isArConnectInstalled, isMetamaskInstalled} from "../utils/Util";
import {loginIconSize} from "../utils/ThemeUtil";
import {useSnakeBarContext} from "../utils/SnackBar";
import {useUserContext} from "../context/UserContext";
import React, {useState} from "react";
import {connectToMetamask} from "./MetamaskLogin";
import {connectToWalletconnect} from "./WalletconnectLogin";
import {grey} from "@mui/material/colors";
import {CloseableDialogTitle} from "./CloseableDialogTitle";
import LoadingWidget from "./LoadingWidget";

export interface LoginDialogProps {
    open: boolean,
    onClose: (value: string) => void;
    closeDialog: () => void;
}

interface LoginType {
    onClick: () => void;
    logo: string,
    text: string,
    disableReason: string | null,
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

        const result = await connectToMetamask(setUserState);

        if (result) {
            closeDialog();
        }
        setLoading(false);
    }

    const startWalletconnect = async () => {
        setLoading(true);

        await connectToWalletconnect(setUserState);

        closeDialog();
        setLoading(false);
    }

    const loginList: LoginType[] = [
        {
            text: "ArConnect",
            logo: "https://cdn.metaforo.io/images/connect/arconnect_thumb.png",
            onClick: startArConnect,
            disableReason: isArConnectInstalled() ? null : 'You haven\'t install ArConnect plugin yet.',
        },
        {
            text: "Metamask",
            logo: "https://cdn.metaforo.io/images/connect/metamask_thumb.png",
            onClick: startMetamaskConnect,
            disableReason: isMetamaskInstalled() ? null : 'You haven\'t install Metamask plugin yet.',
        },
        {
            text: "WalletConnect",
            logo: "https://cdn.metaforo.io/images/connect/wc_thumb.png",
            onClick: startWalletconnect,
            disableReason: null,
        },
    ];

    const avatarSxProps: SxProps<Theme> = {width: loginIconSize, height: loginIconSize, position: 'absolute',};

    let content = (<List sx={{visibility: loading ? 'hidden' : 'visible'}}>
        {loginList.map((loginType: LoginType) => {
            const btn = (
                <ListItemButton
                    key={loginType.text}
                    onClick={loginType.onClick}
                    disabled={loginType.disableReason != null}
                    sx={{
                        border: 1,
                        borderRadius: '12px',
                        borderColor: grey["400"],
                        marginX: '36px',
                        marginY: '10px',
                        height: '54px',
                    }}
                >
                    <Avatar alt={loginType.text}
                            src={loginType.logo}
                            sx={avatarSxProps}
                    />
                    <ListItemText
                        primary={loginType.text}
                        primaryTypographyProps={
                            {fontWeight: 'bold', fontSize: 16, align: "center", flexGrow: 1}
                        }/>
                </ListItemButton>
            );
            if (loginType.disableReason == null) {
                return btn;
            } else {
                return <Tooltip key={loginType.text}
                                title={loginType.disableReason}><span>{btn}</span></Tooltip>;
            }
        })}
    </List>);
    return (
        <Dialog
            onClose={handleClose}
            open={open}
            maxWidth={"sm"}
            fullWidth={true}>
            <CloseableDialogTitle onClose={handleClose}>
                {<p>Connect Wallet</p>}
            </CloseableDialogTitle>
            {content}
            <LoadingWidget loading={loading}/>
        </Dialog>
    );
}
