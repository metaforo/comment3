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
    },
}