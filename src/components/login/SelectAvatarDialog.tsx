import {Avatar, Button, Dialog, ImageList, ImageListItem, useTheme} from '@mui/material';
import {CloseableDialogTitle} from '../common/CloseableDialogTitle';
import React, {useEffect, useState} from 'react';
import LoadingWidget from '../common/LoadingWidget';
import {useUserContext} from '../../context/UserContext';
import {loadNftAvatar} from '../../api/ApiService';

type SelectAvatarDialogProp = {
    open: boolean;
    currentAvatarUrl: string;
    onClose: (avatarUrl: string, isNft: boolean) => void;
};

type UserAvatar = {
    url: string;
    isDefault: boolean;
    isSelect: boolean;
    isNft: boolean;
};

const avatarSize = 72;
const count = 6;
const gap = 8;

export default function SelectAvatarDialog(props: SelectAvatarDialogProp) {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const {userInfoState} = useUserContext();

    const [avatarList, setAvatarList] = useState([] as UserAvatar[]);
    const [selectedAvatar, setSelectedAvatarAvatar] = useState(null as UserAvatar | null);

    useEffect(() => {
        init();
        // eslint-disable-next-line
    }, [props]);

    useEffect(() => {
        setAvatarList([]);
        void initAvatar();
        // eslint-disable-next-line
    }, [userInfoState]);

    const init = () => {
        setLoading(false);
        setSelectedAvatarAvatar(null);
        if (avatarList.length === 0) {
            void initAvatar();
        } else {
            avatarList.forEach((item) => {
                item.isSelect = item.url === props.currentAvatarUrl;
            });
            setAvatarList(([] as UserAvatar[]).concat(avatarList));
        }
    };

    const initAvatar = async () => {
        if (!props.open) {
            return;
        }

        setLoading(true);

        // Avoid duplicate avatar. (Between current & nft)
        const avatarUrlSet = new Set<string>();
        const avatarList = [] as UserAvatar[];

        // 1. current avatar
        if (userInfoState.avatar && !userInfoState.avatar.includes('img/default_avatar_')) {
            avatarList.push({
                url: userInfoState.avatar,
                isDefault: false,
                isSelect: true,
                isNft: false,
            } as UserAvatar);
            avatarUrlSet.add(userInfoState.avatar);
        }

        // 2. nft avatar
        if (userInfoState.ethAddress) {
            await loadNftAvatar(userInfoState.ethAddress).then((result) => {
                result.forEach((nftUrl) => {
                    if (avatarUrlSet.has(nftUrl)) {
                        return;
                    }

                    avatarUrlSet.add(nftUrl);
                    avatarList.push({
                        url: nftUrl,
                        isDefault: false,
                        isSelect: false,
                        isNft: true,
                    } as UserAvatar);
                });
            });
        }

        // 3. default avatar
        for (let i = 1; i < 25; i++) {
            avatarList.push({
                url: `https://metaforo.io/img/default_avatar_${i}.png`,
                isDefault: true,
                isSelect: false,
                isNft: false,
            } as UserAvatar);
        }

        const currentAvatar = avatarList.find((item) => item.url === userInfoState.avatar);
        if (currentAvatar) {
            currentAvatar.isSelect = true;
        }

        setAvatarList(avatarList);
        setLoading(false);
    };

    const buildImageItem = (avatar: UserAvatar) => {
        return (
            <ImageListItem key={avatar.url} onClick={() => onAvatarClick(avatar)}>
                <Avatar
                    src={avatar.url}
                    sx={{
                        width: avatarSize,
                        height: avatarSize,
                        border: `3px solid ${avatar.isSelect ? theme.palette.primary.main : '#00000000'}`,
                    }}
                />
            </ImageListItem>
        );
    };

    const onAvatarClick = (avatar: UserAvatar) => {
        avatarList.forEach((item) => (item.isSelect = false));
        avatar.isSelect = true;
        setAvatarList(([] as UserAvatar[]).concat(avatarList));

        setSelectedAvatarAvatar(avatar);
    };

    const content = (
        <div
            style={{
                visibility: loading ? 'hidden' : 'visible',
                padding: '12px 48px',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <ImageList
                variant={'quilted'}
                cols={count}
                gap={gap}
                sx={{
                    width: avatarSize * count + gap * (count - 1),
                    maxHeight: 450,
                }}
            >
                {avatarList.map(buildImageItem)}
            </ImageList>

            <Button
                variant={'contained'}
                className={'mf-contained-button'}
                disabled={selectedAvatar == null}
                onClick={() => {
                    props.onClose(selectedAvatar?.url ?? '', selectedAvatar.isNft);
                }}
                sx={{
                    width: '120px',
                    height: '44px',
                    marginTop: '12px',
                    marginBottom: '20px',
                }}
            >
                Done
            </Button>
        </div>
    );
    return (
        <Dialog open={props.open} className={'mf-main'} maxWidth={'sm'} fullWidth={true}>
            <CloseableDialogTitle onClose={() => props.onClose('', false)}>
                {<p>Select Your Avatar</p>}
            </CloseableDialogTitle>
            <LoadingWidget loading={loading} />
            {content}
        </Dialog>
    );
}
