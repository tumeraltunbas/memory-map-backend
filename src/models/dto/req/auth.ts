import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { PASSWORD_REGEX } from '../../../constants/regex';
import { User } from '../../entities/user';

export class RegisterReqDto {
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Matches(PASSWORD_REGEX)
    password: string;
}

export class LoginReqDto {
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class UpdatePasswordReqDto {
    @IsNotEmpty()
    @IsString()
    currentPassword: string;

    @IsNotEmpty()
    @IsString()
    @Matches(PASSWORD_REGEX)
    newPassword: string;

    user: User;
}

export class ForgotPasswordReqDto {
    @IsNotEmpty()
    @IsString()
    email: string;
}

export class ResetPasswordReqDto {
    @IsNotEmpty()
    @IsString()
    @Matches(PASSWORD_REGEX)
    password: string;

    resetPasswordToken: string;
}
