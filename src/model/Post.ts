export type Post = {
    id: number,
    content: string,
    tipCount: number,
    likeCount: number,
    createdAt: string,
    children: {
        posts: Post[],
    },
    childrenCount: number,
    user: {
        id: number,
        username: string,
        photoUrl: string,
        ensName?: string,
        web3PublicKeys?: UserPublicKey[],
    },
}

type UserPublicKey = {
    userId: number,
    address: string,
    type: number,
    ensName?: string,
}

export const ROOT_POST = {
    id: 0,
} as Post;