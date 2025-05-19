import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from '../../models/entities/user';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async insertUser(user: User): Promise<string> {
        return await this.userRepository.insertUser(user);
    }

    fetchUserByEmail(email: string): Promise<User> {
        return this.userRepository.fetchUserByEmail(email);
    }

    fetchUserWithTokensByEmail(
        email: string,
        fromLogin: boolean = false,
    ): Promise<User> {
        return this.userRepository.fetchUserWithTokensByEmail(email, fromLogin);
    }

    fetchUserById(userId: string): Promise<User> {
        return this.userRepository.fetchUserById(userId);
    }
}
