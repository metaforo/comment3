import {Post} from './Post';

export type Thread = {
    posts: Post[];
    firstLevelCount: number;
    postsCount: number;
    id: number;
    groupId: number;
    likesCount: number;

    firstPost: Post;
};

export const EMPTY_THREAD = {
    postsCount: 0,
    firstLevelCount: 0,
} as Thread;
