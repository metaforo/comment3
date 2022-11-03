import {ReactNode, useEffect, useState} from "react";
import {loadComment} from "../../api/ApiService";
import {useCommentWidgetContext} from "../../context/CommentWidgetContext";
import {Post} from "../../model/Post";
import {convertJsonKey, serverDateToString} from "../../utils/Util";
import {camelCase} from "lodash";
import {Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import QuillViewer from "./QuillViewer";

export default function CommentList() {
    const {commentWidgetState, commentWidgetDispatch} = useCommentWidgetContext();
    const [postList, setPostList] = useState([] as Post[]);
    const [lastPostId, setLastPostId] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log(commentWidgetState);
        if (commentWidgetState.needRefresh) {
            commentWidgetDispatch({
                siteName: commentWidgetState.siteName,
                pageId: commentWidgetState.pageId,
                needRefresh: false,
            });
            return;
        }

        if (commentWidgetState.siteName && commentWidgetState.pageId) {
            setHasMore(true);
            loadNextPage(0);
        }
        // eslint-disable-next-line
    }, [commentWidgetState]);

    const loadNextPage = (startPostId: number) => {
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        loadComment(commentWidgetState.siteName, commentWidgetState.pageId, startPostId).then(res => {
            setIsLoading(false);
            if (!res) {
                console.log('failed to fetch comment.');
                return;
            }


            if (!res['thread']['posts'] || res['thread']['posts'].length === 0) {
                setHasMore(false);
                return;
            }

            let morePostList = convertJsonKey(res['thread']['posts'], (k) => {
                if (k === 'total_likes') {
                    return 'likeCount';
                }
                return k;
            }, camelCase);


            let newPostList;

            if (startPostId === 0) {
                newPostList = morePostList;
            } else {
                newPostList = postList.concat(morePostList);
            }
            setPostList(newPostList);
            setLastPostId(morePostList[morePostList.length - 1].id);
            if (res['thread']['first_level_count'] === newPostList.length) {
                setHasMore(false);
            }
        })
    }

    // level means 1 or 2
    const createPostItem = (post: Post, level: number, children?: ReactNode) => {
        let clsName;
        if (level === 2) {
            clsName = 'mf-inner-reply';
        } else {
            clsName = 'mf-outer-reply';
        }
        return (
            <ListItem key={post.id} alignItems="flex-start" className={clsName}>
                <ListItemAvatar>
                    <Avatar src={post.user.photoUrl}/>
                </ListItemAvatar>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <ListItemText
                        primary={post.user.username}
                        secondary={serverDateToString(post.createdAt)}
                    />
                    <QuillViewer content={post.content}/>
                    {children}
                </div>
            </ListItem>
        );
    }

    const listItemList = [] as JSX.Element[];
    postList.forEach((post, index) => {
        if (index !== 0) {
            listItemList.push(<Divider variant="inset" component="li" key={post.id + '_divider'}/>);
        }

        let children = null;
        if (post.children && post.children.count > 0) {
            children = (<List>
                {post.children.posts.map((subPost: Post) => {
                    return createPostItem(subPost, 2);
                })}
            </List>);
        }

        listItemList.push(createPostItem(post, 1, children));
    })
    if (hasMore) {
        listItemList.push(<Divider variant="inset" component="li" key='more_divider'/>);
        listItemList.push(
            <LoadingButton
                loading={isLoading}
                onClick={() => {
                    loadNextPage(lastPostId);
                }
                }
                key={'more'}
            >
                Load More
            </LoadingButton>);
    }

    return (
        <List>
            {listItemList}
        </List>
    );
}