import { Inject, Injectable } from '@nestjs/common';
import { MarkdownPhotoService } from './markdown-photo.service';
import {
    DeleteMarkdownPhotoDto,
    UploadMarkdownPhotoDto,
} from '../../models/dto/req/markdown-photo';
import INFRASTRUCTURE_PROVIDERS from '../../constants/infrastructure';
import { S3Instance } from '../../infrastructure/aws/aws';
import { Logger } from '../../infrastructure/logger/logger.service';
import {
    BusinessRuleError,
    ProcessFailureError,
} from '../../infrastructure/error/error';
import { MarkdownPhoto } from '../../models/entities/markdown-photo';
import { ConfigService } from '@nestjs/config';
import { MarkdownConfig } from '../../config/configuration';
import { CONFIGURATION_KEYS } from '../../constants/configuration';
import { ERROR_CODES } from '../../constants/error';
import { Markdown } from '../../models/entities/markdown';
import { MarkdownService } from '../markdown/markdown.service';

@Injectable()
export class MarkdownPhotoOrchestration {
    private readonly markdownConfig: MarkdownConfig;
    constructor(
        private readonly markdownPhotoService: MarkdownPhotoService,
        @Inject(INFRASTRUCTURE_PROVIDERS.S3_INSTANCE)
        private readonly s3Instance: S3Instance,
        private readonly logger: Logger,
        private readonly configService: ConfigService,
        private readonly markdownService: MarkdownService,
    ) {
        this.markdownConfig = this.configService.get<MarkdownConfig>(
            CONFIGURATION_KEYS.markdown,
        );
    }

    async uploadMarkdownPhoto(
        uploadMarkdownPhotoDto: UploadMarkdownPhotoDto,
    ): Promise<void> {
        const { markdownId, user, files } = uploadMarkdownPhotoDto;

        const withPhotos: boolean = true;
        let markdown: Markdown = null;

        try {
            markdown = await this.markdownService.getMarkdownById(
                markdownId,
                user.id,
                withPhotos,
            );
        } catch (error) {
            this.logger.error(
                'Markdown photo orchestration - uploadMarkdownPhoto - getMarkdownById',
                { error },
            );
            throw new ProcessFailureError(error);
        }

        if (!markdown) {
            throw new BusinessRuleError(ERROR_CODES.markdownNotFound);
        }

        const markdownPhotoCount = markdown.photos.length;

        if (
            markdownPhotoCount >= this.markdownConfig.maxFileCount ||
            markdownPhotoCount + files.length > this.markdownConfig.maxFileCount
        ) {
            throw new BusinessRuleError(
                ERROR_CODES.markdownPhotoFileCountExceeded,
            );
        }

        let fileNames: string[] = [];

        try {
            fileNames = await this.s3Instance.uploadFiles(files);
        } catch (error) {
            this.logger.error(
                'Markdown photo orchestration - uploadMarkdownPhoto - uploadFiles',
                { error },
            );
            throw new ProcessFailureError(error);
        }

        const markdownPhotos: MarkdownPhoto[] = fileNames.map((fileName) => ({
            fileName,
            createdAt: new Date(),
            updatedAt: new Date(),
            markdown: markdown,
        }));

        try {
            await this.markdownPhotoService.createMarkdownPhotos(
                markdownPhotos,
            );
        } catch (error) {
            this.logger.error(
                'Markdown photo orchestration - uploadMarkdownPhoto - createMarkdownPhotos',
                { error },
            );
            throw new ProcessFailureError(error);
        }

        return undefined;
    }

    async deleteMarkdownPhoto(
        deleteMarkdownPhotoDto: DeleteMarkdownPhotoDto,
    ): Promise<void> {
        const { markdownPhoto, markdownId } = deleteMarkdownPhotoDto;

        try {
            await this.markdownPhotoService.deleteMarkdownPhoto(
                markdownPhoto.id,
                markdownId,
            );
        } catch (error) {
            this.logger.error(
                'Markdown photo orchestration - deleteMarkdownPhoto - deleteMarkdownPhoto',
                { error },
            );
            throw new ProcessFailureError(error);
        }

        return undefined;
    }
}
