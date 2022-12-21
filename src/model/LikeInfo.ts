export type LikeInfo = {
    usersCount: number;
    currentUserLiked: boolean;
    users: {
        id: number;
        username: string;
        photoUrl?: string;
        isNft?: boolean;
    };
};
