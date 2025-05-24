import { Injectable } from '@nestjs/common';
import { MarkdownService } from './markdown.service';
import { Markdown } from '../../models/entities/markdown';
import { CreateMarkdownReqDto } from '../../models/dto/req/markdown';
import { Logger } from '../../infrastructure/logger/logger.service';
import {
    BusinessRuleError,
    ProcessFailureError,
} from '../../infrastructure/error/error';
import { ERROR_CODES } from '../../constants/error';
import { CreateMarkdownResDto } from '../../models/dto/res/markdown';
import { convertToPoint } from '../../utils/db';

@Injectable()
export class MarkdownOrchestration {
    constructor(
        private readonly markdownService: MarkdownService,
        private readonly logger: Logger,
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
}
