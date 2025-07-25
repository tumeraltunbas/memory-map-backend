import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import {
    LoginReqDto,
    RegisterReqDto,
    UpdatePasswordReqDto,
} from '../../models/dto/req/auth';
import { User } from '../../models/entities/user';
import {
    BusinessRuleError,
    ProcessFailureError,
} from '../../infrastructure/error/error';
import { Logger } from '../../infrastructure/logger/logger.service';
import { ERROR_CODES } from '../../constants/error';
import {
    comparePasswords,
    generateAuthTokens,
    hashPassword,
} from '../../utils/auth';
import { AuthToken, TokenPayload } from '../../models/entities/token';
import { LoginResDto, RegisterResDto } from '../../models/dto/res/auth';
import { UserToken } from '../../models/entities/user-token';
import { DataSource } from 'typeorm';
import { AuthService } from './auth.service';

@Injectable()
export class AuthOrchestration {
    constructor(
        private readonly logger: Logger,
        private readonly userService: UserService,
        private readonly dataSource: DataSource,
        private readonly authService: AuthService,
    ) {}

    async register(registerReqDto: RegisterReqDto): Promise<RegisterResDto> {
        const { email, password } = registerReqDto;

        let existingUser: User = null;

        try {
            existingUser = await this.userService.fetchUserByEmail(email);
        } catch (error) {
            this.logger.error(
                'Auth orchestration - register - fetchUserByEmail',
                {
                    error,
                },
            );
            throw new ProcessFailureError(error);
        }

        if (existingUser) {
            throw new BusinessRuleError(ERROR_CODES.USER_ALREADY_EXISTS);
        }

        let hashedPassword: string = null;

        try {
            hashedPassword = await hashPassword(password);
        } catch (error) {
            this.logger.error('Auth orchestration - register - hashPassword', {
                error,
            });
            throw new ProcessFailureError(error);
        }

        const user: User = new User(email, hashedPassword);

        let insertedUser: User = null;
        let authToken: AuthToken = null;

        try {
            await this.dataSource.transaction(async (manager) => {
                try {
                    insertedUser = await manager.save<User>(user);
                } catch (error) {
                    this.logger.error(
                        'Auth orchestration - register - insertUser',
                        {
                            error,
                        },
                    );
                    throw new ProcessFailureError(error);
                }

                const payload: TokenPayload = {
                    sub: insertedUser.id,
                };

                authToken = generateAuthTokens(payload);

                const userToken: UserToken = new UserToken(
                    insertedUser,
                    authToken.accessToken,
                    authToken.refreshToken,
                );

                try {
                    await manager.save<UserToken>(userToken);
                } catch (error) {
                    this.logger.error(
                        'Auth orchestration - register - insertUserToken',
                        { error },
                    );
                    throw new ProcessFailureError(error);
                }
            });
        } catch (error) {
            this.logger.error(
                'Auth orchestration - register - transaction error',
                {
                    error,
                },
            );
            throw new ProcessFailureError(error);
        }

        const registerResDto: RegisterResDto = {
            userId: insertedUser.id,
            authToken,
        };

        return registerResDto;
    }

    async login(loginReqDto: LoginReqDto): Promise<LoginResDto> {
        const { email, password } = loginReqDto;

        let user: User = null;

        try {
            user = await this.userService.fetchUserWithTokensByEmail(
                email,
                true,
            );
        } catch (error) {
            this.logger.error('Auth orchestration - login - fetchUserByEmail', {
                error,
            });
            throw new ProcessFailureError(error);
        }

        if (!user) {
            throw new BusinessRuleError(ERROR_CODES.INVALID_CREDENTIALS);
        }

        if (!user.isActive) {
            throw new BusinessRuleError(ERROR_CODES.INACTIVE_USER);
        }

        let isValidPassword: boolean = null;

        try {
            isValidPassword = await comparePasswords(password, user.password);
        } catch (error) {
            this.logger.error('Auth orchestration - login - comparePassword', {
                error,
            });
            throw new ProcessFailureError(error);
        }

        if (!isValidPassword) {
            throw new BusinessRuleError(ERROR_CODES.INVALID_CREDENTIALS);
        }

        const tokenIds: string[] = user?.userTokens.map(
            (token: UserToken) => token.id,
        );

        if (tokenIds?.length > 0) {
            try {
                await this.authService.revokeUserTokens(tokenIds);
            } catch (error) {
                this.logger.error(
                    'Auth orchestration - login - comparePassword',
                    { error },
                );
                throw new ProcessFailureError(error);
            }
        }

        const payload: TokenPayload = {
            sub: user.id,
        };

        const authToken = generateAuthTokens(payload);

        const userToken: UserToken = new UserToken(
            user,
            authToken.accessToken,
            authToken.refreshToken,
        );

        try {
            await this.authService.insertUserToken(userToken);
        } catch (error) {
            this.logger.error('Auth orchestration - login - insertUserToken', {
                error,
            });
            throw new ProcessFailureError(error);
        }

        const loginResDto: LoginResDto = {
            authToken,
        };

        return loginResDto;
    }

    async updatePassword(
        updatePasswordReqDto: UpdatePasswordReqDto,
    ): Promise<void> {
        const { user, currentPassword, newPassword } = updatePasswordReqDto;

        if (currentPassword === newPassword) {
            throw new BusinessRuleError(
                ERROR_CODES.CURRENT_AND_NEW_PASSWORD_CANNOT_BE_EQUAL,
            );
        }

        const includePassword: boolean = true;
        let userWithPassword: User = null;

        try {
            userWithPassword = await this.userService.fetchUserById(
                user.id,
                includePassword,
            );
        } catch (error) {
            this.logger.error(
                'Auth orchestration - updatePassword - fetchUserById',
                { error },
            );
            throw new ProcessFailureError(error);
        }

        let isValidPassword: boolean = null;

        try {
            isValidPassword = await comparePasswords(
                currentPassword,
                userWithPassword.password,
            );
        } catch (error) {
            this.logger.error(
                'Auth orchestration - updatePassword - comparePassword',
                {
                    error,
                },
            );
            throw new ProcessFailureError(error);
        }

        if (!isValidPassword) {
            throw new BusinessRuleError(ERROR_CODES.INVALID_CREDENTIALS);
        }

        let hash: string = null;

        try {
            hash = await hashPassword(newPassword);
        } catch (error) {
            this.logger.error(
                'Auth orchestration - updatePassword - hashPassword',
                {
                    error,
                },
            );
            throw new ProcessFailureError(error);
        }

        try {
            await this.userService.updatePassword(user.id, hash);
        } catch (error) {
            this.logger.error(
                'Auth orchestration - updatePassword - updatePassword',
                {
                    error,
                },
            );
            throw new ProcessFailureError(error);
        }

        return undefined;
    }
}
