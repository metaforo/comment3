import {Post} from '../../model/Post';
import {Thread} from '../../model/Thread';
import {Avatar, IconButton, List, ListItem} from '@mui/material';
import {serverDateToString} from '../../utils/Util';
import QuillViewer from './QuillViewer';
import React from 'react';
import CreateCommentWidget from './CreateCommentWidget';
import {LoadingButton} from '@mui/lab';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SvgIcon from '../common/SvgIcon';
import {Theme} from '@mui/material/styles/createTheme';
import {likeIcon, replyIcon} from '../../assets/SvgAssets';

type CommentListItemProps = {
    thread: Thread;
    post: Post;
    level: number;
    onReplySuccess: (replyPostId: number, newPost: Post) => void;
    openingReply: number;
    onShowReplyClick: (post?: Post) => void;
    loadingChildren: Set<number>;
    onLoadingChildrenClick: (post: Post) => void;
    noMorePostSet: Set<number>;
    theme: Theme;
};

export default function CommentListItem(props: CommentListItemProps) {
    const {level, post, theme, ...restProps} = props;

    const isSmallSize = level > 1;
    let clsName;
    if (isSmallSize) {
        clsName = 'mf-inner-reply';
    } else {
        clsName = 'mf-outer-reply';
    }
    let children = null,
        loadingMore = null;
    if (post.children && post.childrenCount > 0) {
        children = (
            <List>
                {post.children.posts.map((subPost: Post) => {
                    return CommentListItem({
                        post: subPost,
                        level: level + 1,
                        theme: theme,
                        ...restProps,
                    });
                })}
            </List>
        );

        const moreChildrenCount = post.childrenCount - post.children.posts.length;
        if (moreChildrenCount > 0 && !props.noMorePostSet.has(post.id)) {
            let loadingBtnChildren;
            if (props.loadingChildren.has(post.id)) {
                loadingBtnChildren = 'Loading...';
            } else {
                loadingBtnChildren = (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        {moreChildrenCount} {moreChildrenCount > 1 ? 'Replies' : 'Reply'} <ArrowDropDownIcon />
                    </div>
                );
            }

            loadingMore = (
                <LoadingButton
                    loading={props.loadingChildren.has(post.id)}
                    onClick={() => props.onLoadingChildrenClick(post)}
                    sx={{
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        marginRight: 'auto',
                    }}
                >
                    {loadingBtnChildren}
                </LoadingButton>
            );
        }
    }
    return (
        <ListItem key={post.id} alignItems='flex-start' className={clsName} disablePadding={true}>
            <Avatar src={post.user.photoUrl} />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        marginBottom: '8px',
                    }}
                >
                    <div className={'mf-username'}>{post.user.ensName ? post.user.ensName : post.user.username}</div>
                    <div
                        className={'mf-datetime'}
                        style={{
                            color: theme.palette.text.secondary,
                        }}
                    >
                        {serverDateToString(post.createdAt)}
                    </div>
                </div>

                <QuillViewer content={post.content} />
                <div className='mf-comment-operation'>
                    <IconButton
                        onClick={() => {
                            props.onShowReplyClick(props.openingReply === post.id ? undefined : post);
                        }}
                    >
                        <SvgIcon data={replyIcon({size: 14, color: theme.palette.text.secondary})} />
                    </IconButton>
                    {/*<IconButton sx={{display: 'none'}}>*/}
                    {/*    <SvgIcon data={likeIcon({size: 14, color: theme.palette.text.secondary})} />*/}
                    {/*</IconButton>*/}
                </div>
                {props.openingReply === post.id && (
                    <div className={'mf-reply-comment'}>
                        <CreateCommentWidget
                            widgetKey={'quill-toolbar-' + post.id}
                            replyPostId={post.id}
                            onClose={() => props.onShowReplyClick()}
                            onReplySuccess={props.onReplySuccess}
                        />
                    </div>
                )}
                {children}
                {loadingMore}
            </div>
        </ListItem>
    );
}
