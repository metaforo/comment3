import {Avatar, Dialog, List, ListItemButton, ListItemText, SxProps, Theme, Tooltip} from "@mui/material";
import {connectToAr} from "./ArconnectLogin";
import {isArConnectInstalled, isMetamaskInstalled} from "../../utils/Util";
import {loginIconSize} from "../../utils/ThemeUtil";
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
    onClose: () => void;
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
    const {setUserState} = useUserContext();
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        onClose();
        // If there's no timeout, the dialog size will be changed before it closed.
        new Promise(resolve => setTimeout(resolve, 300))
            .then(() => {
                setLoading(false);
            });
    }

    // region ---- Login Dialog ----

    const startArConnect = async () => {
        if (!isArConnectInstalled()) {
            return;
        }
        setLoading(true);

        const result = await connectToAr();
        handleSsoResponse(result, LoginType.ar);
    }

    const startMetamaskConnect = async () => {
        if (!isMetamaskInstalled()) {
            return;
        }

        setLoading(true);

        const result = await connectToMetamask();
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

        updateUserStatusByLoginResponse(ssoResponse.user, setUserState);
        Storage.saveItem(Storage.lastLoginType, loginType);

        setLoading(false);
        closeDialog();
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
    // endregion ---- Login Dialog ----

    const avatarSxProps: SxProps<Theme> = {width: loginIconSize, height: loginIconSize, position: 'absolute',};

    const content = (<List sx={{
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
        <>
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
        </>
    );
}