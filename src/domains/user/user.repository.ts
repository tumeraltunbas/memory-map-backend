import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../models/entities/user';
import {
    FindOneOptions,
    FindOptionsSelect,
    FindOptionsWhere,
    Repository,
} from 'typeorm';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async insertUser(user: User): Promise<string> {
        const result = await this.userRepository.insert(user);
        return result.raw?.at(0)?.id;
    }

    fetchUserByEmail(email: string): Promise<User> {
        const query: FindOneOptions<User> = {
            where: {
                email,
            },
        };

        return this.userRepository.findOne(query);
    }

    fetchUserWithTokensByEmail(
        email: string,
        fromLogin: boolean = false,
    ): Promise<User> {
        const query = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.userTokens', 'token')
            .where('user.email = :email', { email });

        if (fromLogin) {
            query.addSelect('user.password');
        }

        return query.getOne();
    }

    fetchUserById(userId: string, includePassword?: boolean): Promise<User> {
        const select: FindOptionsSelect<User> = {
            id: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            isActive: true,
        };

        if (includePassword) {
            select['password'] = true;
        }

        const query: FindOneOptions<User> = {
            where: {
                id: userId,
            },
            select: select,
        };

        return this.userRepository.findOne(query);
    }

    async updatePassword(userId: string, password: string): Promise<void> {
        const query: FindOptionsWhere<User> = {
            id: userId,
        };

        const update: Partial<User> = {
            password,
        };

        await this.userRepository.update(query, update);
    }
}
