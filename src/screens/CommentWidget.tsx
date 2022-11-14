import {updateUserStatusByLoginResponse, UserInfoState, useUserContext} from "../context/UserContext";
import {useCommentWidgetContext} from "../context/CommentWidgetContext";
import {Avatar, Card, List, ListItem, useTheme} from "@mui/material";
import React, {Dispatch, useEffect, useState} from "react";
import {UserStatus} from "../utils/Constants";
import {Storage} from "../utils/Storage";
import CreateCommentWidget from "../components/comment/CreateCommentWidget";
import {initApiService, loadInnerComment, loadThread, refreshLoginStatus} from "../api/ApiService";
import CenterLoadingWidget from "../components/common/CenterLoadingWIdget";
import {Thread} from "../model/Thread";
import {grey} from "@mui/material/colors";
import {LoginDialog} from "../components/login/LoginDialog";
import {Post} from "../model/Post";
import HeaderWidget from "../components/comment/HeaderWidget";
import CommentListItem from "../components/comment/CommentListItem";
import {LoadingButton} from "@mui/lab";

type CommentWidgetProps = {
    siteName: string,
    pageId: string,
    needRefresh?: boolean,
    variant?: string,
}

const ALL_CLOSED = -1;
const ROOT_REPLY = 0;

export default function CommentWidget(props: CommentWidgetProps) {
    const {userInfoState, setUserState} = useUserContext();
    const {commentWidgetState, commentWidgetDispatch} = useCommentWidgetContext();
    /// user login & load thread
    const [isInitializing, setIsInitializing] = useState(true);
    const [isOpenLoginDialog, setIsOpenLoginDialog] = useState(false);
    const closeLoginDialog = () => {
        setIsOpenLoginDialog(false);
    }
    /// Comment List
    const [thread, setThread] = useState(null as Thread | null);
    const [postList, setPostList] = useState([] as Post[]);
    const [showFullLoading, setShowFullLoading] = useState(false);
    const [showTailLoading, setShowTailLoading] = useState(false);
    const [showInnerLoading, setShowInnerLoading] = useState(new Set<number>());

    /// Only one reply dialog can be shown
    const [openReply, setOpenReply] = useState(ALL_CLOSED);

    /// Check User Login Status
    useEffect(() => {
        commentWidgetDispatch(props);
        if (userInfoState.loginStatus === UserStatus.isChecking) {
            _initUserLoginStatus(userInfoState, setUserState).then(() => {
                setIsInitializing(false);
            });
        } else {
            setIsInitializing(false);
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (commentWidgetState.needRefresh) {
            commentWidgetDispatch({
                siteName: commentWidgetState.siteName,
                pageId: commentWidgetState.pageId,
                needRefresh: false,
            });
            return;
        }

        setOpenReply(ALL_CLOSED);
        if (commentWidgetState.siteName && commentWidgetState.pageId) {
            loadNextPage(0);
        }
        // eslint-disable-next-line
    }, [commentWidgetState]);

    const hasMorePost = () => {
        if (thread == null) {
            return false;
        } else {
            // firstLevelCount contains an empty "first_post".
            return thread.firstLevelCount - 1 > postList.length;
        }
    }

    const loadNextPage = (startPostId: number) => {
        if (showTailLoading) {
            return;
        }
        if (startPostId === 0) {
            setShowFullLoading(true);
        } else {
            setShowTailLoading(true);
        }

        loadThread(commentWidgetState.siteName, commentWidgetState.pageId, startPostId)
            .then((res) => {
                setShowFullLoading(false);
                setShowTailLoading(false);

                if (!res || !res['thread']) {
                    setThread(null);
                    return;
                }

                const thread = res['thread'] as Thread;
                setThread(thread);
                if (!thread.posts || thread.posts.length === 0) {
                    return;
                }

                let newPostList;
                if (startPostId === 0) {
                    newPostList = thread.posts;
                } else {
                    newPostList = postList.concat(thread.posts);
                }
                setPostList(newPostList);
            });
    }

    const loadMoreReplies = (post: Post) => {
        showInnerLoading.add(post.id);
        setShowInnerLoading(new Set(showInnerLoading));

        return loadInnerComment(commentWidgetState.siteName, post.id, post.children.posts.last().id)
            .then((res) => {
                showInnerLoading.delete(post.id);
                setShowInnerLoading(new Set(showInnerLoading));
                if (!res || !res['post']) {
                    return;
                }

                const newPost = res['post'] as Post;
                if (newPost.children && newPost.children.posts) {
                    post.children.posts = [...post.children.posts, ...newPost.children.posts];
                    setPostList(postList);
                }
            });
    }

    const handleReplyPost = (replyPostId: number, newPost: Post) => {
        let newPostList;
        if (replyPostId === 0) {
            newPostList = [newPost].concat(postList);
            if (thread) {
                thread.firstLevelCount += 1;
            }
        } else {
            const repliedPost = postList.find((p) => {
                if (p.id === replyPostId) {
                    return true;
                }

                if (!p.children || !p.children.posts) {
                    return false;
                }

                return p.children.posts.find((child) => {
                    return child.id === replyPostId;
                }) !== undefined;
            });

            if (repliedPost) {
                if (repliedPost.children.posts) {
                    repliedPost.children.posts = [newPost].concat(repliedPost.children.posts);
                    repliedPost.childrenCount += 1;
                } else {
                    repliedPost.children.posts = [newPost];
                    repliedPost.childrenCount = 1;
                }
                newPostList = ([] as Post[]).concat(postList);
            } else {
                newPostList = [newPost].concat(postList);
            }
        }

        if (thread) {
            thread.postsCount += 1;
            setThread(thread);
        }
        setOpenReply(ALL_CLOSED);
        setPostList(newPostList);
    }

    function onReplyClick() {
        if (userInfoState.loginStatus === UserStatus.login) {
            setOpenReply(ROOT_REPLY);
        } else {
            setIsOpenLoginDialog(true);
        }
    }

    // region ---- Comment List ----

    const listItemList = [] as JSX.Element[];
    postList.forEach((post) => {
        listItemList.push(CommentListItem({
            thread: thread!,
            post: post,
            level: 1,
            onReplySuccess: handleReplyPost,
            openingReply: openReply,
            onShowReplyClick: (post?: Post) => {
                if (post) {
                    setOpenReply(post.id);
                } else {
                    setOpenReply(ALL_CLOSED);
                }
            },
            loadingChildren: showInnerLoading,
            onLoadingChildrenClick: loadMoreReplies,
        }));
    });
    if (hasMorePost()) {
        listItemList.push(
            <ListItem
                key={'has-more'}
                sx={{justifyContent: 'center',}}>
                <LoadingButton
                    loading={showTailLoading}
                    onClick={() => loadNextPage(postList.last().id)}
                    sx={{
                        display: 'flex',
                        textTransform: 'none',
                    }}
                >
                    {showTailLoading ? 'Loading...' : 'Load More'}
                </LoadingButton>
            </ListItem>
        );
    }

    // endregion ---- Comment List ----

    const widget = (
        <>
            <HeaderWidget thread={thread}/>
            {ReplyPostWidget(userInfoState, openReply === ROOT_REPLY, (b: boolean) => {
                if (b) {
                    setOpenReply(ROOT_REPLY);
                } else {
                    setOpenReply(ALL_CLOSED);
                }
            }, onReplyClick, handleReplyPost,)}
            {showFullLoading ?
                <CenterLoadingWidget height={240}/> :
                <List
                    className={'mf-comment-list'}
                    disablePadding={true}
                    sx={{
                        margin: 0,
                        padding: 0,
                    }}>
                    {listItemList}
                </List>
            }

            <LoginDialog open={isOpenLoginDialog} onClose={closeLoginDialog}
                         closeDialog={closeLoginDialog}/>
        </>
    );

    return WidgetContainer(widget, isInitializing, props.variant);
}

async function _initUserLoginStatus(userInfoState: UserInfoState, dispatch: Dispatch<UserInfoState>) {
    const userToken = Storage.getItem(Storage.userToken);
    if (userToken) {
        initApiService(userToken);
        return refreshLoginStatus().then((res) => {
            if (res.data && res.data.user) {
                userInfoState.loginStatus = UserStatus.login;
                updateUserStatusByLoginResponse(res.data, dispatch);
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

function WidgetContainer(widget: JSX.Element, isInitializing: boolean, variant?: string,): JSX.Element {
    const loadingWidget = (
        <>
            <div style={{
                display: !isInitializing ? 'none' : undefined,
            }}>
                <CenterLoadingWidget minHeight={'240px'}/>
            </div>
            <div style={{
                display: isInitializing ? 'none' : undefined,
            }}>
                {widget}
            </div>
        </>
    );


    if (variant === 'plain') {
        return loadingWidget;
    } else {
        return (
            <Card
                variant="outlined"
                sx={{
                    padding: '20px 18px',
                }}
            >
                {loadingWidget}
            </Card>
        );
    }
}

function ReplyPostWidget(
    userInfoState: UserInfoState,
    isOpenReply: boolean,
    setIsOpenReply: (isOpen: boolean) => void,
    onReplyClick: () => void,
    handleReplyPost: (replyPostId: number, newPost: Post) => void,
) {
    const theme = useTheme();
    let avatarSx = {
        width: '40px',
        height: '40px',
        marginRight: '16px',
        backgroundColor: grey[200],
    }
    let avatarWidget, replyWidget;
    if (userInfoState.loginStatus === UserStatus.login) {
        avatarWidget = (
            <Avatar src={userInfoState.avatar} sx={avatarSx}></Avatar>
        );
    } else {
        avatarWidget = (
            <Avatar sx={avatarSx}/>
        );
    }
    if (isOpenReply) {
        replyWidget = (<CreateCommentWidget
            replyPostId={0}
            widgetKey={'quill-toolbar-header'}
            onClose={() => {
                setIsOpenReply(false)
            }}
            onReplySuccess={handleReplyPost}
        />);
    } else {
        replyWidget = (
            <div className={'mf-reply-area'}
                 style={{
                     backgroundColor: (theme.palette as any).inputField.background,
                     color: theme.palette.action.disabled,
                     cursor: userInfoState.loginStatus === UserStatus.login ? 'text' : 'default',
                 }}
                 onClick={onReplyClick}
            >
                Write a reply
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            width: '100%',
            marginTop: '22px',
        }}>
            {avatarWidget}
            {replyWidget}
        </div>
    );
}