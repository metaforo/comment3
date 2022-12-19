import {updateUserStatusByLoginResponse, UserInfoState, useUserContext} from '../../context/UserContext';
import React, {Dispatch, useEffect, useState} from 'react';
import {UserStatus} from '../../utils/Constants';
import {Storage} from '../../utils/Storage';
import {initApiService, likeThread, loadThread, refreshLoginStatus, unlikeThread} from '../../api/ApiService';
import {Thread} from '../../model/Thread';
import {Button, useTheme} from '@mui/material';
import {LoginDialog} from '../login/LoginDialog';
import SvgIcon from '../common/SvgIcon';
import {doneIcon, likeIcon} from '../../assets/SvgAssets';
import {formatNumber} from '../../utils/Util';

type LikeWidgetProps = {
    siteName: string;
    pageId: string;
}

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

    useEffect(() => {
        _initUserLoginStatus(userInfoState, setUserState)
            .then(() => initLikeStatus())
            .then(() => setIsInitializing(false));
    }, []);

    const initLikeStatus = () => {
        loadThread(props.siteName, props.pageId, 0)
            .then((res) => {
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
                },
            );
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
        icon = <SvgIcon data={doneIcon({
            size: 15,
            color: theme.palette.primary.contrastText,
        })} />;
    } else {
        icon = <SvgIcon data={likeIcon({
            size: 15,
            color: theme.palette.primary.contrastText,
        })} />;
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
                sx={{
                    width: '140px',
                    height: '44px',
                }}
            >
                <div style={{display: 'flex'}}>
                    <div style={{marginRight: 6, display: 'flex'}}>{icon}</div>
                    <div style={{display: 'flex'}}>{text}</div>
                </div>
            </Button>

            <LoginDialog open={isOpenLoginDialog} closeDialog={closeLoginDialog} />
        </div>
    );
}

async function _initUserLoginStatus(userInfoState: UserInfoState, dispatch: Dispatch<UserInfoState>) {
    if (userInfoState.loginStatus !== UserStatus.isChecking) {
        return false;
    }

    const userToken = Storage.getItem(Storage.userToken);
    if (userToken) {
        initApiService(userToken);
        return refreshLoginStatus().then((res) => {
            if (res.data && res.data.user) {
                userInfoState.loginStatus = UserStatus.login;
                updateUserStatusByLoginResponse(res.data.user, dispatch);
                return true;
            } else {
                userInfoState.loginStatus = UserStatus.notLogin;
                dispatch(userInfoState);
                return false;
            }
        });
    } else {
        userInfoState.loginStatus = UserStatus.notLogin;
        dispatch(userInfoState);
        return false;
    }
}