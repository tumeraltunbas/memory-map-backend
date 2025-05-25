import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MarkdownPhoto } from '../../models/entities/markdown-photo';
import { JwtMiddleware } from '../../middlewares/jwt.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '../../infrastructure/logger/logger.module';
import { MarkdownPhotoController } from './markdown-photo.controller';
import { MarkdownPhotoOrchestration } from './markdown-photo.orchestration';
import { MarkdownPhotoService } from './markdown-photo.service';
import { MarkdownPhotoRepository } from './markdown-photo.repository';

@Module({
    imports: [TypeOrmModule.forFeature([MarkdownPhoto]), LoggerModule],
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
    }
}
