export type Post = {
    id: number;
    content: string;
    tipCount: number;
    likeCount: number;
    createdAt: string;
    children: {
        posts: Post[];
    };
    childrenCount: number;
    user: User;
    liked: boolean; // 0 or 1, if current user is liked.
};

type User = {
    id: number;
    username: string;
    photoUrl: string;
    displayName?: string;
    displayAvatar?: string;
    ensName?: string;
    web3PublicKeys?: UserPublicKey[];
};

type UserPublicKey = {
    userId: number;
    address: string;
    type: number;
    ensName?: string;
};

export const ROOT_POST = {
    id: 0,
} as Post;
