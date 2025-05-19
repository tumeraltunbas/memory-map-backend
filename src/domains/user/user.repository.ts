import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../models/entities/user';
import { FindOneOptions, Repository } from 'typeorm';

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

    fetchUserById(userId: string): Promise<User> {
        const query: FindOneOptions<User> = {
            where: {
                id: userId,
            },
        };

        return this.userRepository.findOne(query);
    }
}
