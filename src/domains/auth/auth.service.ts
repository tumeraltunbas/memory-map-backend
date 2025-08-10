import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { UserToken } from '../../models/entities/user-token';
import { PasswordResetToken } from '../../models/entities/password-reset-token';

@Injectable()
export class AuthService {
    constructor(private readonly authRepository: AuthRepository) {}

    async insertUserToken(userToken: UserToken): Promise<void> {
        await this.authRepository.insertUserToken(userToken);
        return undefined;
    }

    async revokeUserTokens(tokenIds: string[]): Promise<void> {
        await this.authRepository.revokeUserTokens(tokenIds);
    }

    fetchUserTokenByAccessToken(accessToken: string): Promise<UserToken> {
        return this.authRepository.fetchUserTokenByAccessToken(accessToken);
    }

    async updateUserTokenAccessToken(
        userTokenId: string,
        accessToken: string,
    ): Promise<void> {
        await this.authRepository.updateUserTokenAccessToken(
            userTokenId,
            accessToken,
        );
    }

    async insertPasswordResetToken(token: PasswordResetToken): Promise<void> {
        await this.authRepository.insertPasswordResetToken(token);
    }

    fetchValidResetPasswordToken(
        resetPasswordToken: string,
    ): Promise<PasswordResetToken> {
        return this.authRepository.fetchValidResetPasswordToken(
            resetPasswordToken,
        );
    }

    async markPasswordResetTokenUsed(id: string): Promise<void> {
        await this.authRepository.markPasswordResetTokenUsed(id);
    }

    countPasswordResetTokensSince(
        userId: string,
        since: Date,
    ): Promise<number> {
        return this.authRepository.countPasswordResetTokensSince(userId, since);
    }
}
