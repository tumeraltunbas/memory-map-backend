import { Inject, Injectable } from '@nestjs/common';
import { MarkdownService } from './markdown.service';
import { Markdown } from '../../models/entities/markdown';
import {
    CreateMarkdownReqDto,
    DeleteMarkdownReqDto,
    GetMarkdownReqDto,
    GetMarkdownsReqDto,
    UpdateMarkdownReqDto,
} from '../../models/dto/req/markdown';
import { Logger } from '../../infrastructure/logger/logger.service';
import {
    BusinessRuleError,
    ProcessFailureError,
} from '../../infrastructure/error/error';
import { ERROR_CODES } from '../../constants/error';
import {
    CreateMarkdownResDto,
    GetMarkdownResDto,
    GetMarkdownsResDto,
} from '../../models/dto/res/markdown';
import { convertToPoint } from '../../utils/db';
import { MarkdownMapper } from './markdown.mapper';
import INFRASTRUCTURE_PROVIDERS from '../../constants/infrastructure';
import { S3Instance } from '../../infrastructure/aws/aws';

@Injectable()
export class MarkdownOrchestration {
    constructor(
        private readonly markdownService: MarkdownService,
        private readonly logger: Logger,
        private readonly markdownMapper: MarkdownMapper,
        @Inject(INFRASTRUCTURE_PROVIDERS.S3_INSTANCE)
        private readonly s3Instance: S3Instance,
    ) {}

    async createMarkdown(
        createMarkdownReqDto: CreateMarkdownReqDto,
    ): Promise<CreateMarkdownResDto> {
        const { title, coordinates, user } = createMarkdownReqDto;

        let existingMarkdown: Markdown = null;

        try {
            existingMarkdown =
                await this.markdownService.getMarkdownByGeoLocation(
                    coordinates,
                );
        } catch (error) {
            this.logger.error(
                'Markdown orchestration - createMarkdown - getMarkdownByGeoLocation',
                { error },
            );
            throw new ProcessFailureError(error);
        }

        if (existingMarkdown) {
            throw new BusinessRuleError(ERROR_CODES.MARKDOWN_ALREADY_EXISTS);
        }

        const markdown: Markdown = {
            title,
            geoLocation: convertToPoint(coordinates),
            user,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        let markdownId: string = null;

        try {
            markdownId = await this.markdownService.insertMarkdown(markdown);
        } catch (error) {
            this.logger.error(
                'Markdown orchestration - createMarkdown - insertMarkdown',
                { error },
            );
            throw new ProcessFailureError(error);
        }

        const createMarkdownResDto: CreateMarkdownResDto = {
            markdownId: markdownId,
        };

        return createMarkdownResDto;
    }

    async getMarkdowns(
        getMarkdownsReqDto: GetMarkdownsReqDto,
    ): Promise<GetMarkdownsResDto> {
        const { user } = getMarkdownsReqDto;

        let markdowns: Markdown[] = null;

        try {
            markdowns = await this.markdownService.getMarkdowns(user.id);
        } catch (error) {
            this.logger.error(
                'Markdown orchestration - getMarkdowns - getMarkdowns',
                { error },
            );
            throw new ProcessFailureError(error);
        }

        const getMarkdownsResDto: GetMarkdownsResDto =
            this.markdownMapper.mapMarkdowns(markdowns);

        return getMarkdownsResDto;
    }

    async deleteMarkdown(
        deleteMarkdownReqDto: DeleteMarkdownReqDto,
    ): Promise<void> {
        const { markdown, user } = deleteMarkdownReqDto;

        try {
            await this.markdownService.deleteMarkdown(markdown.id, user.id);
        } catch (error) {
            this.logger.error(
                'Markdown orchestration - getMarkdowns - deleteMarkdown',
                { error },
            );
            throw new ProcessFailureError(error);
        }

        return undefined;
    }

    async getMarkdown(
        getMarkdownReqDto: GetMarkdownReqDto,
    ): Promise<GetMarkdownResDto> {
        const { markdownId, user } = getMarkdownReqDto;

        const withPhotos: boolean = true;
        const withNotes: boolean = true;

        let markdown: Markdown = null;

        try {
            markdown = await this.markdownService.getMarkdownById(
                markdownId,
                user.id,
                withPhotos,
                withNotes,
            );
        } catch (error) {
            this.logger.error(
                'Markdown orchestration - getMarkdown - getMarkdownById',
                { error },
            );
            throw new ProcessFailureError(error);
        }

        if (!markdown) {
            throw new BusinessRuleError(ERROR_CODES.MARKDOWN_NOT_FOUND);
        }

        const presignedUrls: string[] = [];

        if (markdown.photos?.length > 0) {
            for (const photo of markdown.photos) {
                let presignedUrl: string = null;

                try {
                    presignedUrl = await this.s3Instance.getPresignedUrl(
                        photo.fileName,
                    );
                } catch (error) {
                    this.logger.error(
                        'Markdown orchestration - getMarkdown - getPresignedUrl',
                        { error, fileName: photo.fileName },
                    );
                    continue;
                }

                presignedUrls.push(presignedUrl);
            }
        }

        const getMarkdownResDto: GetMarkdownResDto =
            this.markdownMapper.mapMarkdown(markdown, presignedUrls);

        return getMarkdownResDto;
    }

    async updateMarkdown(
        updateMarkdownReqDto: UpdateMarkdownReqDto,
    ): Promise<void> {
        const { title, user, markdown } = updateMarkdownReqDto;

        const updatedMarkdown: Partial<Markdown> = {
            title,
            updatedAt: new Date(),
        };

        try {
            await this.markdownService.updateMarkdown(
                markdown.id,
                user.id,
                updatedMarkdown,
            );
        } catch (error) {
            this.logger.error(
                'Markdown orchestration - updateMarkdown - updateMarkdown',
                { error },
            );
            throw new ProcessFailureError(error);
        }

        return undefined;
    }
}
