import { Controller, Get, Req } from '@nestjs/common';
import { USER_ROUTES } from '../../constants/prefix';
import { GetUserResDto } from '../../models/dto/res/user';
import { CustomRequest } from '../../models/entities/request';

@Controller(USER_ROUTES.BASE)
export class UserController {
    constructor() {}

    @Get()
    async getUser(@Req() req: CustomRequest): Promise<GetUserResDto> {
        const getUserResDto: GetUserResDto = {
            userId: req.user.id,
            email: req.user.email,
            isActive: req.user.isActive,
            createdAt: req.user.createdAt,
            updatedAt: req.user.updatedAt,
        };

        return getUserResDto;
    }
}
