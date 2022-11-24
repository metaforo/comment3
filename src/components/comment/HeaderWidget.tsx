import {Thread} from '../../model/Thread';
import {logout, useUserContext} from '../../context/UserContext';
import React from 'react';
import {useCommentWidgetContext} from '../../context/CommentWidgetContext';
import {UserStatus} from '../../utils/Constants';
import {Button, Typography} from '@mui/material';
import {grey} from '@mui/material/colors';
import {Global} from '../../utils/GlobalVariables';
import {apiHost} from '../../api/ApiService';

type HeaderWidgetProps = {
    thread: Thread | null;
};

export default function HeaderWidget(props: HeaderWidgetProps) {
    const {userInfoState, setUserState} = useUserContext();
    const {commentWidgetState} = useCommentWidgetContext();
    const {thread} = props;

    // HeaderWidget, include comment count, sort, logout
    let commentCountStr;
    if (thread === null) {
        commentCountStr = 'Loading...';
    } else {
        if (thread.postsCount === 0) {
            commentCountStr = 'No Comment';
        } else if (thread.postsCount === 1) {
            commentCountStr = '1 Comment';
        } else {
            commentCountStr = `${thread.postsCount} Comments`;
        }
    }

    let logoutBtn;
    if (userInfoState.loginStatus === UserStatus.login) {
        logoutBtn = (
            <Button
                variant={'text'}
                onClick={() => logout(setUserState)}
                sx={{
                    fontSize: '14px',
                    color: grey['600'],
                    textTransform: 'none',
                }}
            >
                Log Out
            </Button>
        );
    } else {
        logoutBtn = null;
    }

    let debugBtn;
    if (Global.isDebug && thread) {
        // @ts-ignore
        const link = `${apiHost.replace('/api', '/')}g/${commentWidgetState.siteName}/thread/${thread.id}`;
        debugBtn = (
            <a
                href={link}
                style={{
                    marginLeft: '12px',
                    fontSize: '10px',
                }}
            >
                Open Metaforo
            </a>
        );
    } else {
        debugBtn = null;
    }

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
            }}
        >
            <Typography
                sx={{
                    fontWeight: 'bold',
                }}
            >
                {commentCountStr}
            </Typography>
            {debugBtn}
            <div
                style={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'flex-end',
                }}
            >
                {logoutBtn}
            </div>
        </div>
    );
}
