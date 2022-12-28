import {useUserContext} from '../../context/UserContext';
import {useCommentWidgetContext} from '../../context/CommentWidgetContext';
import {Avatar, Card, List, ListItem, useTheme} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {UserStatus} from '../../utils/Constants';
import CreateCommentWidget from './CreateCommentWidget';
import {likePost, loadInnerComment, loadThread, unlikePost} from '../../api/ApiService';
import CenterLoadingWidget from '../common/CenterLoadingWIdget';
import {EMPTY_THREAD, Thread} from '../../model/Thread';
import {grey} from '@mui/material/colors';
import {LoginDialog} from '../login/LoginDialog';
import {Post, ROOT_POST} from '../../model/Post';
import HeaderWidget from './HeaderWidget';
import CommentListItem from './CommentListItem';
import {LoadingButton} from '@mui/lab';
import {addItemToSetState} from '../../utils/Util';
import {getEns} from '../../utils/EnsService';
import EditProfileDialog from '../login/EditProfileDialog';
import {useGlobalContext} from '../../context/GlobalContext';
import {initLoginStatus, refreshByStorage} from '../../utils/UserUtil';
import {EventItem, StorageEvent} from '../../utils/Storage';

type CommentWidgetProps = {
    siteName: string;
    pageId: string;
    needRefresh?: boolean;
    variant?: string;
};

const ALL_CLOSED = -1;
const ROOT_REPLY = 0;

const resolvedEnsMap = {} as any;

export default function CommentWidget(props: CommentWidgetProps) {
    const theme = useTheme();

    const {userInfoState, setUserState} = useUserContext();
    const {globalState} = useGlobalContext();
    const {commentWidgetState, commentWidgetDispatch} = useCommentWidgetContext();
    const isLogin = userInfoState.loginStatus === UserStatus.login;
    /// user login & load thread
    const [isInitializing, setIsInitializing] = useState(true);
    const [isOpenLoginDialog, setIsOpenLoginDialog] = useState(false);
    const closeLoginDialog = () => {
        setIsOpenLoginDialog(false);
    };
    /// user profile
    const [showUpdateProfileDialog, setShowUpdateProfileDialog] = useState(false);

    /// Comment List
    const [thread, setThread] = useState(null as Thread | null);
    const [postList, setPostList] = useState([] as Post[]);
    const [showFullLoading, setShowFullLoading] = useState(false);
    const [showTailLoading, setShowTailLoading] = useState(false);
    const [showInnerLoading, setShowInnerLoading] = useState(new Set<number>());
    const [noMorePost, setNoMorePost] = useState(new Set<number>());

    /// Only one reply dialog can be shown
    const [openReply, setOpenReply] = useState(ALL_CLOSED);

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
        // eslint-disable-next-line
    }, []);

    /// Check User Login Status
    useEffect(() => {
        commentWidgetDispatch(props);
        if (userInfoState.loginStatus === UserStatus.isChecking) {
            initLoginStatus(props.siteName, userInfoState, setUserState).then(() => {
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

        setNoMorePost(new Set());
        setOpenReply(ALL_CLOSED);
        if (commentWidgetState.siteName && commentWidgetState.pageId) {
            loadNextPage(0);
        }
        // eslint-disable-next-line
    }, [commentWidgetState]);

    useEffect(() => {
        setOpenReply(ALL_CLOSED);

        if (userInfoState.isNew && !globalState.disableEditProfile) {
            setShowUpdateProfileDialog(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfoState]);

    const hasMorePost = () => {
        if (thread == null) {
            return false;
        } else {
            // firstLevelCount contains an empty "first_post".
            return thread.firstLevelCount - 1 > postList.length;
        }
    };

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
            .then(async (res) => {
                if (!res || !res['thread']) {
                    setThread(EMPTY_THREAD);
                    return;
                }

                const thread = res['thread'] as Thread;
                setThread(thread);
                if (!thread.posts || thread.posts.length === 0) {
                    addItemToSetState(ROOT_REPLY, noMorePost, setNoMorePost);
                    return;
                }

                await loadEnsNameForPostList(thread.posts, resolvedEnsMap);

                let newPostList;
                if (startPostId === 0) {
                    newPostList = thread.posts;
                } else {
                    newPostList = postList.concat(thread.posts);
                }
                setPostList(newPostList);
            })
            .finally(() => {
                setShowFullLoading(false);
                setShowTailLoading(false);
            });
    };

    const loadMoreReplies = (post: Post) => {
        showInnerLoading.add(post.id);
        setShowInnerLoading(new Set(showInnerLoading));

        return loadInnerComment(commentWidgetState.siteName, post.id, post.children.posts.last().id)
            .then(async (res) => {
                if (!res || !res['post']) {
                    addItemToSetState(post.id, noMorePost, setNoMorePost);
                    return;
                }

                const newPost = res['post'] as Post;
                await loadEnsNameForPostList(newPost.children.posts, resolvedEnsMap);
                if (newPost.children && newPost.children.posts) {
                    post.children.posts = [...post.children.posts, ...newPost.children.posts];
                    setPostList(postList);
                } else {
                    addItemToSetState(post.id, noMorePost, setNoMorePost);
                }
            })
            .finally(() => {
                showInnerLoading.delete(post.id);
                setShowInnerLoading(new Set(showInnerLoading));
            });
    };

    const handleReplyPost = async (replyPostId: number, newPost: Post) => {
        await loadEnsNameForPostList([newPost], resolvedEnsMap);
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

                return (
                    p.children.posts.find((child) => {
                        return child.id === replyPostId;
                    }) !== undefined
                );
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
    };

    function clickReply(post?: Post) {
        if (isLogin) {
            if (post) {
                setOpenReply(post.id);
            } else {
                setOpenReply(ALL_CLOSED);
            }
        } else {
            setIsOpenLoginDialog(true);
        }
    }

    function clickLike(post: Post) {
        if (!isLogin) {
            setIsOpenLoginDialog(true);
            return;
        }

        if (post.liked) {
            post.likeCount = (post.likeCount ?? 1) - 1;
            post.liked = !post.liked;
            // noinspection JSIgnoredPromiseFromCall
            unlikePost(commentWidgetState.siteName, post.id);
        } else {
            post.likeCount = (post.likeCount ?? 0) + 1;
            post.liked = !post.liked;
            // noinspection JSIgnoredPromiseFromCall
            likePost(commentWidgetState.siteName, post.id);
        }
        setPostList([].concat(postList));
    }

    // region ---- Comment List ----

    const listItemList = [] as JSX.Element[];
    postList.forEach((post) => {
        listItemList.push(
            CommentListItem({
                thread: thread!,
                post: post,
                level: 1,
                onReplySuccess: handleReplyPost,
                openingReply: openReply,
                onShowReplyClick: clickReply,
                onLikeClick: clickLike,
                loadingChildren: showInnerLoading,
                onLoadingChildrenClick: loadMoreReplies,
                noMorePostSet: noMorePost,
                theme: theme,
            }),
        );
    });
    if (hasMorePost()) {
        listItemList.push(
            <ListItem key={'has-more'} sx={{justifyContent: 'center'}}>
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
            </ListItem>,
        );
    }

    // endregion ---- Comment List ----

    const editProfile = () => {
        if (isLogin) {
            if (!globalState.disableEditProfile) {
                setShowUpdateProfileDialog(true);
            }
        } else {
            setIsOpenLoginDialog(true);
        }
    };

    const rootReplyWidget = () => {
        const avatarSx = {
            width: '40px',
            height: '40px',
            marginRight: '16px',
            backgroundColor: grey[200],
        };
        let replyWidget;
        if (openReply === ROOT_REPLY) {
            replyWidget = (
                <CreateCommentWidget
                    replyPostId={0}
                    widgetKey={'quill-toolbar-header'}
                    onClose={() => setOpenReply(ALL_CLOSED)}
                    onReplySuccess={handleReplyPost}
                />
            );
        } else {
            replyWidget = (
                <div
                    className={'mf-reply-area'}
                    style={{
                        backgroundColor: (theme.palette as any).action.hover,
                        color: theme.palette.action.disabled,
                        cursor: isLogin ? 'text' : 'default',
                    }}
                    onClick={() => clickReply(ROOT_POST)}
                >
                    Write a reply
                </div>
            );
        }

        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    width: '100%',
                    marginTop: '22px',
                }}
            >
                <Avatar src={isLogin ? userInfoState.avatar : ''} sx={avatarSx} onClick={editProfile} />
                {replyWidget}
            </div>
        );
    };

    const widget = (
        <div className={'mf-main'}>
            <HeaderWidget thread={thread} />
            {rootReplyWidget()}
            {showFullLoading ? (
                <CenterLoadingWidget height={240} />
            ) : (
                <List
                    className={'mf-comment-list'}
                    disablePadding={true}
                    sx={{
                        margin: 0,
                        padding: 0,
                    }}
                >
                    {listItemList}
                </List>
            )}

            <LoginDialog open={isOpenLoginDialog} closeDialog={closeLoginDialog} />
            <EditProfileDialog
                open={showUpdateProfileDialog}
                closeDialog={() => {
                    setShowUpdateProfileDialog(false);
                }}
            />
        </div>
    );

    return WidgetContainer(widget, isInitializing, props.variant);
}

function WidgetContainer(widget: JSX.Element, isInitializing: boolean, variant?: string): JSX.Element {
    const loadingWidget = (
        <>
            <div
                style={{
                    display: !isInitializing ? 'none' : undefined,
                }}
            >
                <CenterLoadingWidget minHeight={'240px'} />
            </div>
            <div
                style={{
                    display: isInitializing ? 'none' : undefined,
                }}
            >
                {widget}
            </div>
        </>
    );

    if (variant === 'plain') {
        return loadingWidget;
    } else {
        return (
            <Card
                variant='outlined'
                sx={{
                    padding: '20px 18px',
                }}
            >
                {loadingWidget}
            </Card>
        );
    }
}

async function loadEnsNameForPostList(postList: Post[], resolvedMap: any) {
    // step 1: generic userId->address map
    const addressMap = {} as any;
    genericEnsResolvedMap(postList, addressMap);

    // step 2: generic userId->ensName map
    const futureList = [];
    for (const userId of Object.keys(addressMap)) {
        if (resolvedMap[userId]) {
            continue;
        }

        const ensNameFuture = getEns(addressMap[userId]).then((ensName) => {
            if (ensName) {
                resolvedMap[userId] = ensName;
            } else {
                resolvedMap[userId] = `${addressMap[userId].substring(0, 6)}...${addressMap[userId].substring(
                    addressMap[userId].length - 4,
                )}`;
            }
        });
        futureList.push(ensNameFuture);
    }
    await Promise.all(futureList);

    const setEnsName = (post: Post) => {
        if (resolvedMap[post.user.id]) {
            if (resolvedMap[post.user.id].includes('...') && !post.user.username.startsWith('w_sso')) {
                // No ens but has normal username, do nothing.
            } else {
                post.user.ensName = resolvedMap[post.user.id];
            }
        }
    };

    // step 3: assign ensName for post.
    postList.forEach((post: Post) => {
        setEnsName(post);
        if (post.children && post.children.posts) {
            post.children.posts.forEach(setEnsName);
        }
    });
}

function genericEnsResolvedMap(postList: Post[], resolvedMap: any) {
    postList.forEach((post: Post) => {
        if (post.children && post.children.posts) {
            genericEnsResolvedMap(post.children.posts, resolvedMap);
        }
        if (post.user && post.user.web3PublicKeys) {
            if (resolvedMap[post.user.id]) {
                return;
            } else {
                const pk = post.user.web3PublicKeys.find((pk) => {
                    return pk.type === 0 || pk.type === 5;
                });
                if (pk) {
                    resolvedMap[post.user.id] = pk.address;
                }
            }
        }
    });
}
