import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ErrorResponseBody } from './error';
import { Request, Response } from 'express';
import { createErrorResponseBody } from '../../utils/error';
import { Logger } from '../logger/logger.service';
import { logResponse } from '../../utils/log';

@Catch()
export class AllExceptionFilter<T> implements ExceptionFilter {
    constructor(private readonly logger: Logger) {}
    catch(exception: T, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request: Request = ctx.getRequest();
        const response: Response = ctx.getResponse();

        const errorResponseBody: ErrorResponseBody =
            createErrorResponseBody(exception);

        logResponse({ request, errorResponseBody, exception }, this.logger);

        const { code, message, status, data } = errorResponseBody;
        response.status(status).json({ code, message, data });
    }
}
