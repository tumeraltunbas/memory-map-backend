import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { MarkdownPhoto } from '../../models/entities/markdown-photo';
import { JwtMiddleware } from '../../middlewares/jwt.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '../../infrastructure/logger/logger.module';
import { MarkdownPhotoController } from './markdown-photo.controller';
import { MarkdownPhotoOrchestration } from './markdown-photo.orchestration';
import { MarkdownPhotoService } from './markdown-photo.service';
import { MarkdownPhotoRepository } from './markdown-photo.repository';
import { AwsS3Module } from '../aws/s3.module';
import { MarkdownModule } from '../markdown/markdown.module';
import { MarkdownPhotoMiddleware } from '../../middlewares/markdown-photo.middleware';
import { combineUrl } from '../../utils/string';
import { MARKDOWN_PHOTO_ROUTES } from '../../constants/prefix';

@Module({
    imports: [
        TypeOrmModule.forFeature([MarkdownPhoto]),
        LoggerModule,
        AwsS3Module,
        MarkdownModule,
    ],
    controllers: [MarkdownPhotoController],
    providers: [
        MarkdownPhotoService,
        MarkdownPhotoRepository,
        MarkdownPhotoOrchestration,
    ],
    exports: [MarkdownPhotoService],
})
export class MarkdownPhotoModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware).forRoutes(MarkdownPhotoController);
        consumer.apply(MarkdownPhotoMiddleware).forRoutes({
            path: combineUrl(
                MARKDOWN_PHOTO_ROUTES.BASE,
                MARKDOWN_PHOTO_ROUTES.DELETE,
            ),
            method: RequestMethod.POST,
        });
    }
}
