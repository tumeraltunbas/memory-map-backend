import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { MarkdownNoteController } from './markdown-note.controller';
import { MarkdownNoteService } from './markdown.note.service';
import { MarkdownNoteRepository } from './markdown-note.repository';
import { MarkdownNoteOrchestration } from './markdow-note.orchestration';
import { JwtMiddleware } from '../../middlewares/jwt.middleware';
import { MarkdownMiddleware } from '../../middlewares/markdown.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarkdownNote } from '../../models/entities/markdown-note';
import { LoggerModule } from '../../infrastructure/logger/logger.module';
import { MARKDOWN_NOTE_ROUTES } from '../../constants/prefix';
import { combineUrl } from '../../utils/string';
import { MarkdownNoteMiddleware } from '../../middlewares/markdown-note.middleware';

@Module({
    imports: [TypeOrmModule.forFeature([MarkdownNote]), LoggerModule],
    controllers: [MarkdownNoteController],
    providers: [
        MarkdownNoteService,
        MarkdownNoteRepository,
        MarkdownNoteOrchestration,
    ],
    exports: [MarkdownNoteService],
})
export class MarkdownNoteModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware).forRoutes(MarkdownNoteController);
        consumer.apply(MarkdownMiddleware).forRoutes({
            path: MARKDOWN_NOTE_ROUTES.BASE,
            method: RequestMethod.POST,
        });
        consumer.apply(MarkdownNoteMiddleware).forRoutes({
            path: combineUrl(
                MARKDOWN_NOTE_ROUTES.BASE,
                MARKDOWN_NOTE_ROUTES.UPDATE,
            ),
            method: RequestMethod.PATCH,
        });
    }
}
