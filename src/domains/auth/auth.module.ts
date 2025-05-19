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

@Module({
    imports: [UserModule, TypeOrmModule.forFeature([UserToken])],
    providers: [AuthService, AuthOrchestration, AuthRepository],
    controllers: [AuthController],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(JwtMiddleware)
            .forRoutes({ path: 'auth/example', method: RequestMethod.GET });
    }
}
