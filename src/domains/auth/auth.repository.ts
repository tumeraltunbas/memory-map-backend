import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from '../../models/entities/user-token';
import { FindOneOptions, FindOptionsWhere, In, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class AuthRepository {
    constructor(
        @InjectRepository(UserToken)
        private readonly userTokenRepository: Repository<UserToken>,
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
}
