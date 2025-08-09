import { Controller, Get, Req } from '@nestjs/common';
import { USER_ROUTES } from '../../constants/prefix';
import { GetProfileResDto, GetUserResDto } from '../../models/dto/res/user';
import { CustomRequest } from '../../models/entities/request';
import { GetProfileReqDto } from '../../models/dto/req/user';
import { UserOrchestration } from './user.orchestration';

@Controller(USER_ROUTES.BASE)
export class UserController {
    constructor(private readonly userOrchestration: UserOrchestration) {}

    @Get()
    getUser(@Req() req: CustomRequest): GetUserResDto {
        const getUserResDto: GetUserResDto = {
            userId: req.user.id,
            email: req.user.email,
            isActive: req.user.isActive,
            createdAt: req.user.createdAt,
            updatedAt: req.user.updatedAt,
        };

        return getUserResDto;
    }

    @Get(USER_ROUTES.PROFILE)
    async getProfile(@Req() req: CustomRequest): Promise<GetProfileResDto> {
        const getProfileReqDto: GetProfileReqDto = {
            user: req.user,
        };

        const getProfileResDto: GetProfileResDto =
            await this.userOrchestration.getProfile(getProfileReqDto);

        return getProfileResDto;
    }
}
