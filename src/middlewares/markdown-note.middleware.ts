import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { CustomRequest } from '../models/entities/request';
import { MiddlewareService } from '../domains/middleware/middleware.service';
import {
    BusinessRuleError,
    ProcessFailureError,
} from '../infrastructure/error/error';
import { ERROR_CODES } from '../constants/error';
import { MarkdownNote } from '../models/entities/markdown-note';
import { Logger } from '../infrastructure/logger/logger.service';

@Injectable()
export class MarkdownNoteMiddleware implements NestMiddleware {
    constructor(
        private readonly middlewareService: MiddlewareService,
        private readonly logger: Logger,
    ) {}

    async use(req: CustomRequest, res: Response, next: NextFunction) {
        const markdownNoteId: string = req.params?.markdownNoteId;
        const markdownId: string = req.body?.markdownId;

        if (!markdownNoteId) {
            throw new BusinessRuleError(ERROR_CODES.markdownNoteIdNotFound);
        }

        let markdownNote: MarkdownNote = null;

        try {
            markdownNote = await this.middlewareService.getMarkdownNoteById(
                markdownNoteId,
                markdownId,
            );
        } catch (error) {
            this.logger.error(
                'MarkdownNoteMiddleware - use - getMarkdownNoteById',
                {
                    error,
                },
            );
            throw new ProcessFailureError(error);
        }

        if (!markdownNote) {
            throw new BusinessRuleError(ERROR_CODES.markdownNoteNotFound);
        }

        req.markdownNote = markdownNote;

        next();
    }
}
