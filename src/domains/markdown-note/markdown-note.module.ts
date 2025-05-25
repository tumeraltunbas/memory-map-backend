import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MarkdownNoteController } from './markdown-note.controller';
import { MarkdownNoteService } from './markdown.note.service';
import { MarkdownNoteRepository } from './markdown-note.repository';
import { MarkdownNoteOrchestration } from './markdow-note.orchestration';
import { JwtMiddleware } from '../../middlewares/jwt.middleware';
import { MarkdownMiddleware } from '../../middlewares/markdown.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarkdownNote } from '../../models/entities/markdown-note';
import { LoggerModule } from '../../infrastructure/logger/logger.module';

@Module({
    imports: [TypeOrmModule.forFeature([MarkdownNote]), LoggerModule],
    controllers: [MarkdownNoteController],
    providers: [
        MarkdownNoteService,
        MarkdownNoteRepository,
        MarkdownNoteOrchestration,
    ],
})
export class MarkdownNoteModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware).forRoutes(MarkdownNoteController);
        consumer.apply(MarkdownMiddleware).forRoutes(MarkdownNoteController);
    }
}
