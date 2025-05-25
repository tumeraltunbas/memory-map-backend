import { Module } from '@nestjs/common';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { loadConfigModule, loadTypeOrmModule } from './utils/module-loader';
import { AuthModule } from './domains/auth/auth.module';
import { MarkdownModule } from './domains/markdown/markdown.module';
import { MiddlewareModule } from './domains/middleware/middleware.module';
import { MarkdownNoteModule } from './domains/markdown-note/markdown-note.module';
import { MarkdownPhotoModule } from './domains/markdown-photo/markdown-photo.module';

@Module({
    imports: [
        LoggerModule,
        loadConfigModule(),
        loadTypeOrmModule(),
        AuthModule,
        MarkdownModule,
        MiddlewareModule,
        MarkdownNoteModule,
        MarkdownPhotoModule,
    ],
})
export class AppModule {}
