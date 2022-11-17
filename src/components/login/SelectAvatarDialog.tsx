import {Avatar, Button, Dialog, ImageList, ImageListItem, useTheme} from "@mui/material";
import {CloseableDialogTitle} from "../common/CloseableDialogTitle";
import React, {useEffect, useState} from "react";
import LoadingWidget from "../common/LoadingWidget";
import {useUserContext} from "../../context/UserContext";

type SelectAvatarDialogProp = {
    open: boolean,
    currentAvatarUrl: string,
    onClose: (value: string) => void,
}

type UserAvatar = {
    url: string,
    isDefault: boolean,
    isSelect: boolean,
}

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
    }, [props]);

    const init = () => {
        setLoading(false);
        setSelectedAvatarAvatar(null);
        if (avatarList.length === 0) {
            initAvatar();
        } else {
            avatarList.forEach(item => {
                item.isSelect = item.url === props.currentAvatarUrl;
            });
            setAvatarList(([] as UserAvatar[]).concat(avatarList));
        }
    }

    const initAvatar = () => {
        setLoading(true);

        const avatarList = [];
        for (let i = 1; i < 25; i++) {
            avatarList.push(
                {
                    url: `https://metaforo.io/img/default_avatar_${i}.png`,
                    isDefault: true,
                    isSelect: false,
                } as UserAvatar
            );
        }

        setAvatarList(([] as UserAvatar[]).concat(avatarList));

        setLoading(false);
    }

    const buildImageItem = (avatar: UserAvatar) => {
        return (
            <ImageListItem
                key={avatar.url}
                onClick={() => onAvatarClick(avatar)}
            >
                <Avatar src={avatar.url}
                        sx={{
                            width: avatarSize,
                            height: avatarSize,
                            border: `3px solid ${avatar.isSelect ? theme.palette.primary.main : '#00000000'}`,
                        }}
                />

            </ImageListItem>
        );
    }

    const onAvatarClick = (avatar: UserAvatar) => {
        avatarList.forEach(item => item.isSelect = false);
        avatar.isSelect = true;
        setAvatarList(([] as UserAvatar[]).concat(avatarList));

        setSelectedAvatarAvatar(avatar);
    }

    const content = (
        <div
            style={{
                visibility: loading ? 'hidden' : 'visible',
                padding: '12px 48px',
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
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
                variant={"contained"}
                className={'mf-contained-button'}
                disabled={selectedAvatar == null}
                onClick={() => {
                    props.onClose(selectedAvatar?.url ?? '');
                }}
                sx={{
                    width: '120px',
                    height: '44px',
                    marginTop: '12px',
                    marginBottom: '20px',
                }}
            >Done</Button>
        </div>
    );
    return (
        <Dialog
            open={props.open}
            className={'mf-main'}
            maxWidth={"sm"}
            fullWidth={true}
        >
            <CloseableDialogTitle onClose={() => props.onClose('')}>
                {<p>Select Your Avatar</p>}
            </CloseableDialogTitle>
            <LoadingWidget loading={loading}/>
            {content}
        </Dialog>
    );
}