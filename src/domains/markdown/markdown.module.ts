import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MarkdownController } from './markdown.controller';
import { MarkdownOrchestration } from './markdown.orchestration';
import { MarkdownRepository } from './markdown.repository';
import { MarkdownService } from './markdown.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Markdown } from '../../models/entities/markdown';
import { JwtMiddleware } from '../../middlewares/jwt.middleware';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([Markdown]), AuthModule, UserModule],
    controllers: [MarkdownController],
    providers: [MarkdownOrchestration, MarkdownRepository, MarkdownService],
})
export class MarkdownModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware).forRoutes(MarkdownController);
    }
}
