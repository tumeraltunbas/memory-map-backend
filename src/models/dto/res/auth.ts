import { AuthToken } from '../../entities/token';

export interface RegisterResDto {
    userId: string;
    authToken: AuthToken;
}

export interface LoginResDto {
    authToken: AuthToken;
}
