import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { CustomRequest } from '../models/entities/request';
import {
    BusinessRuleError,
    ProcessFailureError,
} from '../infrastructure/error/error';
import { ERROR_CODES } from '../constants/error';
import { Markdown } from '../models/entities/markdown';
import { Logger } from '../infrastructure/logger/logger.service';
import { MiddlewareService } from '../domains/middleware/middleware.service';

@Injectable()
export class MarkdownMiddleware implements NestMiddleware {
    constructor(
        private readonly middlewareService: MiddlewareService,
        private readonly logger: Logger,
    ) {}

    async use(req: CustomRequest, res: Response, next: NextFunction) {
        const markdownId: string =
            req.params?.markdownId || req.body?.markdownId;

        if (!markdownId) {
            throw new BusinessRuleError(ERROR_CODES.MARKDOWN_ID_NOT_FOUND);
        }

        let markdown: Markdown = null;

        try {
            markdown = await this.middlewareService.getMarkdownById(
                markdownId,
                req.user.id,
            );
        } catch (error) {
            this.logger.error('Markdown middleware - use - getMarkdownById', {
                error,
            });
            throw new ProcessFailureError(error);
        }

        if (!markdown) {
            throw new BusinessRuleError(ERROR_CODES.MARKDOWN_NOT_FOUND);
        }

        req.markdown = markdown;

        next();
    }
}
