import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthOrchestration } from './auth.orchestration';
import { AuthRepository } from './auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToken } from '../../models/entities/user-token';
import { JwtMiddleware } from '../../middlewares/jwt.middleware';
import { combineUrl } from '../../utils/string';
import { AUTH_ROUTES } from '../../constants/prefix';

@Module({
    imports: [UserModule, TypeOrmModule.forFeature([UserToken])],
    providers: [AuthService, AuthOrchestration, AuthRepository],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware).forRoutes({
            path: combineUrl(AUTH_ROUTES.BASE, AUTH_ROUTES.PASSWORD_CHANGE),
            method: RequestMethod.PATCH,
        });
    }
}
