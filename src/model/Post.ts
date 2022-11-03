export type Post = {
    id: number,
    content: string,
    tipCount: number,
    likeCount: number,
    createdAt: string,
    children: {
        count: number,
        posts: Post[],
    },
    user: {
        id: number,
        username: string,
        photoUrl: string,
    },
}