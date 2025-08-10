import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from '../../models/entities/user-token';
import {
    FindOneOptions,
    FindOptionsWhere,
    In,
    MoreThan,
    Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { PasswordResetToken } from '../../models/entities/password-reset-token';

@Injectable()
export class AuthRepository {
    constructor(
        @InjectRepository(UserToken)
        private readonly userTokenRepository: Repository<UserToken>,
        @InjectRepository(PasswordResetToken)
        private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
    ) {}

    async insertUserToken(userToken: UserToken): Promise<void> {
        await this.userTokenRepository.insert(userToken);
        return undefined;
    }

    async revokeUserTokens(tokenIds: string[]): Promise<void> {
        const query: FindOptionsWhere<UserToken> = {
            id: In(tokenIds),
            isRevoked: false,
        };

        const update: QueryDeepPartialEntity<UserToken> = {
            isRevoked: true,
            updatedAt: new Date(),
        };

        await this.userTokenRepository.update(query, update);
    }

    fetchUserTokenByAccessToken(accessToken: string): Promise<UserToken> {
        const query: FindOneOptions<UserToken> = {
            where: { accessToken: accessToken },
        };

        return this.userTokenRepository.findOne(query);
    }

    async updateUserTokenAccessToken(
        userTokenId: string,
        accessToken: string,
    ): Promise<void> {
        const query: FindOptionsWhere<UserToken> = {
            id: userTokenId,
        };

        const update: QueryDeepPartialEntity<UserToken> = {
            accessToken: accessToken,
            updatedAt: new Date(),
        };

        await this.userTokenRepository.update(query, update);
    }

    async insertPasswordResetToken(token: PasswordResetToken): Promise<void> {
        await this.passwordResetTokenRepository.save(token);
    }

    async fetchValidResetPasswordToken(
        resetPasswordToken: string,
    ): Promise<PasswordResetToken> {
        const query: FindOneOptions<PasswordResetToken> = {
            where: { token: resetPasswordToken },
            relations: ['user'],
        };

        return this.passwordResetTokenRepository.findOne(query);
    }

    async markPasswordResetTokenUsed(id: string): Promise<void> {
        const query: FindOptionsWhere<PasswordResetToken> = { id };
        const update: QueryDeepPartialEntity<PasswordResetToken> = {
            usedAt: new Date(),
        };

        await this.passwordResetTokenRepository.update(query, update);
    }

    async countPasswordResetTokensSince(
        userId: string,
        since: Date,
    ): Promise<number> {
        return this.passwordResetTokenRepository.count({
            relations: ['user'],
            where: {
                user: { id: userId },
                createdAt: MoreThan(since),
            },
        });
    }
}
