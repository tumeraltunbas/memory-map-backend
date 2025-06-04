import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MarkdownController } from './markdown.controller';
import { MarkdownOrchestration } from './markdown.orchestration';
import { MarkdownRepository } from './markdown.repository';
import { MarkdownService } from './markdown.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Markdown } from '../../models/entities/markdown';
import { JwtMiddleware } from '../../middlewares/jwt.middleware';
import { MarkdownMapper } from './markdown.mapper';
import { AwsS3Module } from '../aws/s3.module';

@Module({
    imports: [TypeOrmModule.forFeature([Markdown]), AwsS3Module],
    controllers: [MarkdownController],
    providers: [
        MarkdownOrchestration,
        MarkdownRepository,
        MarkdownService,
        MarkdownMapper,
    ],
    exports: [MarkdownService],
})
export class MarkdownModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware).forRoutes(MarkdownController);
    }
}
