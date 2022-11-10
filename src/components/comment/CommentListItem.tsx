import {Post} from "../../model/Post";
import {Thread} from "../../model/Thread";
import {Avatar, IconButton, List, ListItem} from "@mui/material";
import {grey} from "@mui/material/colors";
import {serverDateToString} from "../../utils/Util";
import QuillViewer from "./QuillViewer";
import ReplyIcon from "../../assets/reply.svg";
import LikeIcon from "../../assets/like.svg";
import React from "react";
import CreateCommentWidget from "./CreateCommentWidget";
import {LoadingButton} from "@mui/lab";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SvgIcon from "../common/SvgIcon";

type CommentListItemProps = {
    thread: Thread,
    post: Post,
    level: number,
    onReply: () => void,
    openingReply: number,
    onShowReplyClick: (post?: Post) => void,
    loadingChildren: Set<number>,
    onLoadingChildrenClick: (post: Post) => void,
}

export default function CommentListItem(props: CommentListItemProps) {
    const {level, post, ...restProps} = props;
    const isSmallSize = level > 1;
    let clsName;
    if (isSmallSize) {
        clsName = 'mf-inner-reply';
    } else {
        clsName = 'mf-outer-reply';
    }
    let children = null, loadingMore = null;
    if (post.children && post.childrenCount > 0) {
        children = (<List>
            {post.children.posts.map((subPost: Post) => {
                return CommentListItem({
                    post: subPost,
                    level: level + 1,
                    ...restProps,
                });
            })}
        </List>);

        const moreChildrenCount = post.childrenCount - post.children.posts.length;
        if (moreChildrenCount > 0) {
            let loadingBtnChildren;
            if (props.loadingChildren.has(post.id)) {
                loadingBtnChildren = 'Loading...';
            } else {
                loadingBtnChildren = (<div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {moreChildrenCount} {moreChildrenCount > 1 ? 'Replies' : 'Reply'} <ArrowDropDownIcon/>
                </div>);
            }

            loadingMore = (<LoadingButton
                loading={props.loadingChildren.has(post.id)}
                onClick={() => props.onLoadingChildrenClick(post)}
                sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    marginRight: 'auto',
                }}
            >
                {loadingBtnChildren}
            </LoadingButton>)
        }
    }
    return (
        <ListItem key={post.id} alignItems="flex-start" className={clsName} disablePadding={true}
        >
            <Avatar src={post.user.photoUrl}/>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    marginBottom: '8px',
                }}>
                    <div className={'mf-username'}>{post.user.username}</div>
                    <div className={'mf-datetime'} style={{
                        color: grey[600],
                    }}>
                        {serverDateToString(post.createdAt)}
                    </div>
                </div>

                <QuillViewer content={post.content}/>
                <div className='mf-comment-operation'>
                    <IconButton onClick={() => {
                        props.onShowReplyClick(props.openingReply === post.id ? undefined : post);
                    }}>
                        <SvgIcon src={ReplyIcon} size={14}/>
                    </IconButton>
                    <IconButton sx={{display: "none"}}>
                        <SvgIcon src={LikeIcon} size={14}/>
                    </IconButton>
                </div>
                {props.openingReply === post.id &&
                    <div className={'mf-reply-comment'}>
                        <CreateCommentWidget
                            widgetKey={'quill-toolbar-' + post.id}
                            replyPostId={post.id}
                            onClose={() => props.onShowReplyClick()}/>
                    </div>
                }
                {children}
                {loadingMore}
            </div>
        </ListItem>
    );
}
