export interface AuthUser {
    id: string;
    name: string;
    email: string;
}

export interface User extends AuthUser {
    profile: {
        avatar: string | null;
        bio: string | null;
        city: string | null;
        country: string | null;
    } | null;
}

