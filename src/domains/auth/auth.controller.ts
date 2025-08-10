import {
    Body,
    Controller,
    HttpStatus,
    Patch,
    Post,
    Query,
    Req,
    Res,
} from '@nestjs/common';
import {
    LoginReqDto,
    RegisterReqDto,
    UpdatePasswordReqDto,
    ForgotPasswordReqDto,
    ResetPasswordReqDto,
} from '../../models/dto/req/auth';
import { AuthOrchestration } from './auth.orchestration';
import { RegisterResDto } from '../../models/dto/res/auth';
import { Response } from 'express';
import { SecurityConfig } from '../../config/configuration';
import { ConfigService } from '@nestjs/config';
import { CONFIGURATION_KEYS } from '../../constants/configuration';
import { AUTH_ROUTES } from '../../constants/prefix';
import { CustomRequest } from '../../models/entities/request';

@Controller(AUTH_ROUTES.BASE)
export class AuthController {
    private readonly securityConfig: SecurityConfig;
    constructor(
        private readonly authOrchestration: AuthOrchestration,
        private readonly configService: ConfigService,
    ) {
        this.securityConfig = this.configService.get<SecurityConfig>(
            CONFIGURATION_KEYS.security,
        );
    }

    @Post(AUTH_ROUTES.REGISTER)
    async register(
        @Body() registerReqDto: RegisterReqDto,
        @Res() res: Response,
    ): Promise<void> {
        const { accessTokenHeaderName } = this.securityConfig.jwt;

        const registerResDto: RegisterResDto =
            await this.authOrchestration.register(registerReqDto);

        res.status(HttpStatus.CREATED)
            .cookie(accessTokenHeaderName, registerResDto.authToken.accessToken)
            .json({
                userId: registerResDto.userId,
            });
    }

    @Post(AUTH_ROUTES.LOGIN)
    async login(
        @Body() loginReqDto: LoginReqDto,
        @Res() res: Response,
    ): Promise<void> {
        const { accessTokenHeaderName } = this.securityConfig.jwt;

        const loginResDto = await this.authOrchestration.login(loginReqDto);

        res.status(HttpStatus.CREATED)
            .cookie(accessTokenHeaderName, loginResDto.authToken.accessToken)
            .json({});
    }

    @Patch(AUTH_ROUTES.PASSWORD_CHANGE)
    async updatePassword(
        @Req() req: CustomRequest,
        @Body() updatePasswordReqDto: UpdatePasswordReqDto,
    ): Promise<void> {
        updatePasswordReqDto.user = req.user;

        await this.authOrchestration.updatePassword(updatePasswordReqDto);
        return undefined;
    }

    @Post(AUTH_ROUTES.FORGOT_PASSWORD)
    async forgotPassword(
        @Body() forgotPasswordReqDto: ForgotPasswordReqDto,
    ): Promise<void> {
        await this.authOrchestration.forgotPassword(forgotPasswordReqDto);
        return undefined;
    }

    @Post(AUTH_ROUTES.RESET_PASSWORD)
    async resetPassword(
        @Query('resetPasswordToken') resetPasswordToken: string,
        @Body() resetPasswordReqDto: ResetPasswordReqDto,
    ): Promise<void> {
        resetPasswordReqDto.resetPasswordToken = resetPasswordToken;

        await this.authOrchestration.resetPassword(resetPasswordReqDto);
        return undefined;
    }
}
