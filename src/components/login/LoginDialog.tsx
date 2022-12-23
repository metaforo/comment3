import {Avatar, Dialog, List, ListItemButton, ListItemText, SxProps, Theme, Tooltip} from '@mui/material';
import {isMetamaskInstalled} from '../../utils/Util';
import {loginIconSize} from '../../utils/ThemeUtil';
import {useUserContext} from '../../context/UserContext';
import React, {useEffect, useState} from 'react';
import {connectToMetamask} from './MetamaskLogin';
import {grey} from '@mui/material/colors';
import {CloseableDialogTitle} from '../common/CloseableDialogTitle';
import LoadingWidget from '../common/LoadingWidget';
import {Storage} from '../../utils/Storage';
import {LoginType} from '../../utils/Constants';
import {useGlobalContext} from '../../context/GlobalContext';
import {updateUserStatusByLoginResponse} from '../../utils/UserUtil';

export interface LoginDialogProps {
    open: boolean;
    closeDialog: () => void;
}

interface LoginMethodItem {
    onClick: () => void;
    logo: string;
    text: string;
    disableReason: string | null;
}

export function LoginDialog(props: LoginDialogProps) {
    const {open, closeDialog} = props;
    const {setUserState} = useUserContext();
    const {globalState} = useGlobalContext();
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        closeDialog();
        // If there's no timeout, the dialog size will be changed before it closed.
        new Promise((resolve) => setTimeout(resolve, 300)).then(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        if (props.open) {
            startMetamaskConnect();
        }
        // eslint-disable-next-line
    }, [props]);
    // region ---- Login Dialog ----

    const startMetamaskConnect = async () => {
        if (!isMetamaskInstalled()) {
            closeDialog();
            return;
        }

        setLoading(true);

        const result = await connectToMetamask(globalState);
        handleSsoResponse(result, LoginType.eth);
    };

    const handleSsoResponse = (ssoResponse: any, loginType: string) => {
        if (!ssoResponse) {
            setLoading(false);
            closeDialog();
            return;
        }

        updateUserStatusByLoginResponse(globalState.siteName, ssoResponse.user, setUserState, ssoResponse.is_register);
        Storage.saveItem(Storage.lastLoginType, loginType);

        setLoading(false);
        closeDialog();
    };

    const loginList: LoginMethodItem[] = [
        {
            text: 'Metamask',
            logo: 'https://cdn.metaforo.io/images/connect/metamask_thumb.png',
            onClick: startMetamaskConnect,
            disableReason: isMetamaskInstalled() ? null : 'You haven\'t install Metamask plugin yet.',
        },
    ];
    // endregion ---- Login Dialog ----

    const avatarSxProps: SxProps<Theme> = {width: loginIconSize, height: loginIconSize, position: 'absolute'};

    const content = (
        <List
            sx={{
                visibility: loading ? 'hidden' : 'visible',
                marginTop: '24px',
            }}
        >
            {loginList.map((loginType: LoginMethodItem) => {
                const btn = (
                    <ListItemButton
                        key={loginType.text}
                        onClick={loginType.onClick}
                        disabled={loginType.disableReason != null}
                        sx={{
                            border: 1,
                            borderRadius: '12px',
                            borderColor: grey['400'],
                            marginX: '36px',
                            marginY: '10px',
                            height: '54px',
                        }}
                    >
                        <Avatar alt={loginType.text} src={loginType.logo} sx={avatarSxProps} />
                        <ListItemText
                            primary={loginType.text}
                            primaryTypographyProps={{fontWeight: 'bold', fontSize: 16, align: 'center', flexGrow: 1}}
                        />
                    </ListItemButton>
                );
                if (loginType.disableReason == null) {
                    return btn;
                } else {
                    return (
                        <Tooltip key={loginType.text} title={loginType.disableReason}>
                            <span>{btn}</span>
                        </Tooltip>
                    );
                }
            })}
        </List>
    );

    return (
        <>
            <Dialog onClose={handleClose} open={open} className={'mf-main'} maxWidth={'sm'} fullWidth={true}>
                <CloseableDialogTitle onClose={handleClose}>{<p>Connect Wallet</p>}</CloseableDialogTitle>
                {content}
                <LoadingWidget loading={loading} />
            </Dialog>
        </>
    );
}
