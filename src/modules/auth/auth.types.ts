import type {RoleName} from "../../shared/constants/roles";

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthenticatedIdentity {
    id: string;
    role: RoleName;
    isProfileComplete: boolean;
}
