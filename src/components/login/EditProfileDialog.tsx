import {Avatar, Badge, Button, Dialog, TextField, useTheme} from '@mui/material';
import {CloseableDialogTitle} from '../common/CloseableDialogTitle';
import LoadingWidget from '../common/LoadingWidget';
import SelectAvatarDialog from './SelectAvatarDialog';
import React, {useEffect, useState} from 'react';
import {useCommentWidgetContext} from '../../context/CommentWidgetContext';
import {updateUserStatusByLoginResponse, useUserContext} from '../../context/UserContext';
import {updateProfile, UpdateProfileParam} from '../../api/ApiService';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import styled from '@emotion/styled';
import {sleep} from '../../utils/Util';
import {Global} from '../../utils/GlobalVariables';

type EditProfileDialogProps = {
    open: boolean;
    closeDialog: () => void;
};

export default function EditProfileDialog(props: EditProfileDialogProps) {
    const {open, closeDialog} = props;

    const theme = useTheme();
    const {commentWidgetState, commentWidgetDispatch} = useCommentWidgetContext();
    const {userInfoState, setUserState} = useUserContext();
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [userAvatar, setUserAvatar] = useState('');
    const [profileErr, setProfileErr] = useState('');
    const [isNftAvatar, setIsNftAvatar] = useState(false);
    const [showAvatarDialog, setShowAvatarDialog] = useState(false);

    const handleClose = () => {
        closeDialog();
    };

    useEffect(() => {
        if (!props.open) {
            // 关闭窗口时,进行一次初始化
            sleep(200).then(() => {
                setUsername(userInfoState.displayName ?? userInfoState.username!);
                setUserAvatar(userInfoState.avatar!);

                setProfileErr('');
                setIsNftAvatar(false);
            });
        } else {
            sleep(200).then(() => {
                if (userInfoState.displayName ?? (userInfoState.username && !userInfoState.username.includes('#'))) {
                    setUsername(userInfoState.displayName ?? userInfoState.username!);
                } else {
                    setUsername('');
                }
                setUserAvatar(userInfoState.avatar!);
            });
        }
    }, [userInfoState, props.open]);

    // region ---- Profile Dialog ----

    const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputVal = event.target.value;
        setUsername(inputVal);
    };

    const startUpdateProfile = () => {
        setLoading(true);
        const params = {} as UpdateProfileParam;
        if (username !== userInfoState.displayName) {
            params.display_name = username;
            params.group_name = Global.siteName;
        }
        if (userAvatar !== userInfoState.avatar) {
            params.display_avatar = userAvatar;
            if (isNftAvatar) {
                params.is_nft = 1;
            }
        }
        updateProfile(params)
            .then((res) => {
                if (!res.status) {
                    setProfileErr(res.description);
                    return;
                }

                commentWidgetState.needRefresh = true;
                commentWidgetDispatch(commentWidgetState);

                res.data.isNew = false;
                updateUserStatusByLoginResponse(res.data, setUserState);
                closeDialog();
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onEditAvatarClick = () => {
        setShowAvatarDialog(true);
    };

    const onAvatarSelected = (avatarUrl: string) => {
        setShowAvatarDialog(false);
        if (avatarUrl) {
            setUserAvatar(avatarUrl);
        }
    };

    // endregion ---- Profile Dialog ----

    const content = (
        <div
            className={'mf-dialog-content'}
            style={{
                visibility: loading ? 'hidden' : 'visible',
                padding: '0 48px',
            }}
        >
            <Badge
                overlap={'circular'}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                onClick={() => onEditAvatarClick()}
                sx={{
                    marginTop: '24px',
                }}
                badgeContent={
                    <Avatar
                        sx={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: theme.palette.primary.main,
                        }}
                    >
                        <EditRoundedIcon sx={{width: '16px'}} />
                    </Avatar>
                }
            >
                <Avatar
                    src={userAvatar}
                    sx={{
                        width: '72px',
                        height: '72px',
                    }}
                />
            </Badge>

            <UsernameInputField
                value={username || ''}
                onChange={onUsernameChange}
                label={'Enter Username'}
                sx={{
                    width: '100%',
                    marginTop: '32px',
                }}
            />

            <p
                style={{
                    color: 'red',
                    fontSize: '0.8em',
                    marginTop: '8px',
                    height: '20px',
                }}
            >
                {profileErr}
            </p>

            <Button
                onClick={startUpdateProfile}
                variant={'contained'}
                className={'mf-contained-button'}
                sx={{
                    width: '120px',
                    height: '44px',
                    marginTop: '12px',
                    marginBottom: '20px',
                }}
            >
                Save
            </Button>
        </div>
    );
    return (
        <>
            <Dialog onClose={handleClose} open={open} maxWidth={'sm'} fullWidth={true}>
                <CloseableDialogTitle onClose={handleClose}>{<p>Complete Your Profile</p>}</CloseableDialogTitle>
                {content}
                <LoadingWidget loading={loading} />
            </Dialog>
            <SelectAvatarDialog open={showAvatarDialog} onClose={onAvatarSelected} currentAvatarUrl={userAvatar} />
        </>
    );
}

const UsernameInputField = styled(TextField)`
    fieldset {
        border-radius: 12px;
    }
`;
