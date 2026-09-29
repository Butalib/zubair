export interface IUser {
    _id: string;
    username: string;
    displayName: string;
    status: number;
    privatePrice: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    accessToken: string;
    refreshToken: string;
}

