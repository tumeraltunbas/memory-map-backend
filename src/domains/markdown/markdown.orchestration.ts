import { Injectable } from '@nestjs/common';
import { MarkdownService } from './markdown.service';
import { Markdown } from '../../models/entities/markdown';
import {
    CreateMarkdownReqDto,
    DeleteMarkdownReqDto,
    GetMarkdownsReqDto,
} from '../../models/dto/req/markdown';
import { Logger } from '../../infrastructure/logger/logger.service';
import {
    BusinessRuleError,
    ProcessFailureError,
} from '../../infrastructure/error/error';
import { ERROR_CODES } from '../../constants/error';
import {
    CreateMarkdownResDto,
    GetMarkdownsResDto,
} from '../../models/dto/res/markdown';
import { convertToPoint } from '../../utils/db';
import { MarkdownMapper } from './markdown.mapper';

@Injectable()
export class MarkdownOrchestration {
    constructor(
        private readonly markdownService: MarkdownService,
        private readonly logger: Logger,
        private readonly markdownMapper: MarkdownMapper,
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
            throw new BusinessRuleError(ERROR_CODES.markdownAlreadyExists);
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
        const { markdownId, user } = deleteMarkdownReqDto;

        let markdown: Markdown = null;

        try {
            markdown = await this.markdownService.getMarkdownById(
                markdownId,
                user.id,
            );
        } catch (error) {
            this.logger.error(
                'Markdown orchestration - getMarkdowns - getMarkdownById',
                { error },
            );
            throw new ProcessFailureError(error);
        }

        if (!markdown) {
            throw new BusinessRuleError(ERROR_CODES.markdownNotFound);
        }

        try {
            await this.markdownService.deleteMarkdown(markdownId, user.id);
        } catch (error) {
            this.logger.error(
                'Markdown orchestration - getMarkdowns - getMarkdownById',
                { error },
            );
            throw new ProcessFailureError(error);
        }

        return undefined;
    }
}
