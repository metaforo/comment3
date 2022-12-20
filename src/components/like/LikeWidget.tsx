import {useUserContext} from '../../context/UserContext';
import React, {useEffect, useState} from 'react';
import {UserStatus} from '../../utils/Constants';
import {likeThread, loadThread, unlikeThread} from '../../api/ApiService';
import {Thread} from '../../model/Thread';
import {Button, CircularProgress, useTheme} from '@mui/material';
import {LoginDialog} from '../login/LoginDialog';
import SvgIcon from '../common/SvgIcon';
import {doneIcon, likeIcon} from '../../assets/SvgAssets';
import {formatNumber} from '../../utils/Util';
import {initLoginStatus, refreshByStorage} from '../../utils/UserUtil';
import {EventItem, StorageEvent} from '../../utils/Storage';

type LikeWidgetProps = {
    siteName: string;
    pageId: string;
};

export default function LikeWidget(props: LikeWidgetProps) {
    const theme = useTheme();
    const {userInfoState, setUserState} = useUserContext();
    const [isInitializing, setIsInitializing] = useState(true);
    const [isOpenLoginDialog, setIsOpenLoginDialog] = useState(false);
    const closeLoginDialog = () => {
        setIsOpenLoginDialog(false);
    };
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    // listen storage changes
    const refreshUserByStorage = (e: Event | CustomEvent<EventItem>) =>
        refreshByStorage(e, props.siteName, userInfoState, setUserState);
    useEffect(() => {
        window.addEventListener('storage', refreshUserByStorage);
        window.addEventListener(StorageEvent, refreshUserByStorage);
        return () => {
            window.removeEventListener('storage', refreshUserByStorage);
            window.removeEventListener(StorageEvent, refreshUserByStorage);
        };
    }, []);

    useEffect(() => {
        let f;
        if (userInfoState.loginStatus !== UserStatus.isChecking) {
            f = Promise.resolve();
        } else {
            f = initLoginStatus(props.siteName, userInfoState, setUserState);
        }
        f.then(() => initLikeStatus()).then(() => setIsInitializing(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const initLikeStatus = () => {
        loadThread(props.siteName, props.pageId, 0).then((res) => {
            if (!res || !res['thread']) {
                //  thread not created.
                setLikeCount(0);
                setIsLiked(false);
                return;
            }

            const thread = res['thread'] as Thread;
            setLikeCount(thread.firstPost.likeCount);
            setIsLiked(thread.firstPost.liked);
            return;
        });
    };

    const onClickLike = () => {
        if (userInfoState.loginStatus !== UserStatus.login) {
            setIsOpenLoginDialog(true);
            return;
        }

        if (isLiked) {
            setLikeCount(likeCount - 1);
            setIsLiked(!isLiked);
            unlikeThread(props.siteName, props.pageId);
        } else {
            setLikeCount(likeCount + 1);
            setIsLiked(!isLiked);
            likeThread(props.siteName, props.pageId);
        }
    };

    let icon, text;
    if (isLiked) {
        icon = (
            <SvgIcon
                data={doneIcon({
                    size: 15,
                    color: theme.palette.primary.contrastText,
                })}
            />
        );
    } else {
        icon = (
            <SvgIcon
                data={likeIcon({
                    size: 15,
                    color: theme.palette.primary.contrastText,
                })}
            />
        );
    }
    if (likeCount == 0) {
        text = 'Like';
    } else if (likeCount == 1) {
        text = '1 Like';
    } else {
        text = `${formatNumber(likeCount)} Likes`;
    }

    return (
        <div className={'mf-main'}>
            <Button
                onClick={onClickLike}
                variant={'contained'}
                className={'mf-contained-button'}
                disabled={isInitializing}
                sx={{
                    width: '140px',
                    height: '44px',
                }}
            >
                {isInitializing ? (
                    <CircularProgress size={22} />
                ) : (
                    <div style={{display: 'flex'}}>
                        <div style={{marginRight: 6, display: 'flex'}}>{icon}</div>
                        <div style={{display: 'flex'}}>{text}</div>
                    </div>
                )}
            </Button>
            <LoginDialog open={isOpenLoginDialog} closeDialog={closeLoginDialog} />
        </div>
    );
}
