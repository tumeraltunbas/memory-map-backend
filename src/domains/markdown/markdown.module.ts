import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MarkdownController } from './markdown.controller';
import { MarkdownOrchestration } from './markdown.orchestration';
import { MarkdownRepository } from './markdown.repository';
import { MarkdownService } from './markdown.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Markdown } from '../../models/entities/markdown';
import { JwtMiddleware } from '../../middlewares/jwt.middleware';
import { MarkdownMapper } from './markdown.mapper';

@Module({
    imports: [TypeOrmModule.forFeature([Markdown])],
    controllers: [MarkdownController],
    providers: [
        MarkdownOrchestration,
        MarkdownRepository,
        MarkdownService,
        MarkdownMapper,
    ],
})
export class MarkdownModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware).forRoutes(MarkdownController);
    }
}
