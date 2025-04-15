export interface UserIdentity {
    firstName: string;
    lastName: string;
}

export interface Session {
    id: string;
    userId: string;
    userIdentity: UserIdentity;
}
