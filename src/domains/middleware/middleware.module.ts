import { Global, Module } from '@nestjs/common';
import { MiddlewareService } from './middleware.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { MarkdownModule } from '../markdown/markdown.module';
import { MarkdownNoteModule } from '../markdown-note/markdown-note.module';
import { MarkdownPhotoModule } from '../markdown-photo/markdown-photo.module';

@Global()
@Module({
    imports: [
        AuthModule,
        UserModule,
        MarkdownModule,
        MarkdownNoteModule,
        MarkdownPhotoModule,
    ],
    providers: [MiddlewareService],
    exports: [MiddlewareService],
})
export class MiddlewareModule {}
