import {Avatar, Dialog, List, ListItemButton, ListItemText, SxProps, Theme, Tooltip} from "@mui/material";
import {connectToAr} from "./ArconnectLogin";
import {isArConnectInstalled, isMetamaskInstalled} from "../../utils/Util";
import {loginIconSize} from "../../utils/ThemeUtil";
import {useSnakeBarContext} from "../../utils/SnackBar";
import {updateUserStatusByLoginResponse, useUserContext} from "../../context/UserContext";
import React, {useState} from "react";
import {connectToMetamask} from "./MetamaskLogin";
import {connectToWalletConnectByProvider,} from "./WalletconnectLogin";
import {grey} from "@mui/material/colors";
import {CloseableDialogTitle} from "../common/CloseableDialogTitle";
import LoadingWidget from "../common/LoadingWidget";
import {Storage} from "../../utils/Storage";
import {LoginType} from "../../utils/Constants";

export interface LoginDialogProps {
    open: boolean,
    onClose: (value: string) => void;
    closeDialog: () => void;
}

interface LoginMethodItem {
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

        const result = await connectToAr(setUserState);
        handleSsoResponse(result, LoginType.ar);
    }
    // endregion ---- ArConnect ----

    const startMetamaskConnect = async () => {
        if (!isMetamaskInstalled()) {
            snakeBarDispatch({open: true, message: 'You haven\'t install Metamask plugin yet.'});
            return;
        }

        setLoading(true);

        const result = await connectToMetamask(setUserState);
        handleSsoResponse(result, LoginType.eth);
    }

    const startWalletconnect = async () => {
        setLoading(true);

        const result = await connectToWalletConnectByProvider();
        handleSsoResponse(result, LoginType.walletConnect);
    }

    const handleSsoResponse = (ssoResponse: any, loginType: string) => {
        if (!ssoResponse) {
            setLoading(false);
            return;
        }

        updateUserStatusByLoginResponse(ssoResponse, setUserState);
        Storage.saveItem(Storage.lastLoginType, loginType);

        closeDialog();
        setLoading(false);
    }

    const loginList: LoginMethodItem[] = [
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

    let content = (<List sx={{
        visibility: loading ? 'hidden' : 'visible',
        marginTop: '24px',
    }}>
        {loginList.map((loginType: LoginMethodItem) => {
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
            className={'mf-main'}
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
