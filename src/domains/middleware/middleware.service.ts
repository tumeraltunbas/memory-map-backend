import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { UserToken } from '../../models/entities/user-token';
import { User } from '../../models/entities/user';

@Injectable()
export class MiddlewareService {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    fetchUserTokenByAccessToken(accessToken: string): Promise<UserToken> {
        return this.authService.fetchUserTokenByAccessToken(accessToken);
    }

    async updateUserTokenAccessToken(
        userTokenId: string,
        accessToken: string,
    ): Promise<void> {
        await this.authService.updateUserTokenAccessToken(
            userTokenId,
            accessToken,
        );
    }

    async fetchUserById(userId: string): Promise<User> {
        return this.userService.fetchUserById(userId);
    }
}
