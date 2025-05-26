import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { NextFunction } from 'express';
import { MiddlewareService } from '../domains/middleware/middleware.service';
import { CustomRequest } from '../models/entities/request';
import { Logger } from '../infrastructure/logger/logger.service';
import {
    BusinessRuleError,
    ProcessFailureError,
} from '../infrastructure/error/error';
import { ERROR_CODES } from '../constants/error';
import { MarkdownPhoto } from '../models/entities/markdown-photo';

@Injectable()
export class MarkdownPhotoMiddleware implements NestMiddleware {
    constructor(
        private readonly middlewareService: MiddlewareService,
        private readonly logger: Logger,
    ) {}

    async use(req: CustomRequest, res: Response, next: NextFunction) {
        const markdownPhotoId: string = req.params?.markdownPhotoId;
        const markdownId: string = req.body?.markdownId;
        const userId: string = req.user.id;

        if (!markdownPhotoId || !markdownId) {
            throw new BusinessRuleError(ERROR_CODES.markdownPhotoNotFound);
        }

        let markdownPhoto: MarkdownPhoto = null;

        try {
            markdownPhoto = await this.middlewareService.getMarkdownPhotoById(
                markdownPhotoId,
                markdownId,
                userId,
            );
        } catch (error) {
            this.logger.error(
                'Markdown photo middleware - use - getMarkdownPhotoById',
                { error },
            );
            throw new ProcessFailureError(error);
        }

        if (!markdownPhoto) {
            throw new BusinessRuleError(ERROR_CODES.markdownPhotoNotFound);
        }

        req.markdownPhoto = markdownPhoto;

        next();
    }
}
