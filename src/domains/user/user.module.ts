import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../models/entities/user';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { JwtMiddleware } from '../../middlewares/jwt.middleware';
import { UserOrchestration } from './user.orchestration';
import { LoggerModule } from '../../infrastructure/logger/logger.module';
import { MarkdownModule } from '../markdown/markdown.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), LoggerModule, MarkdownModule],
    controllers: [UserController],
    providers: [UserService, UserRepository, UserOrchestration],
    exports: [TypeOrmModule, UserService],
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware).forRoutes(UserController);
    }
}
