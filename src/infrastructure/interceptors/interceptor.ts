import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';
import { logResponse } from '../../utils/log';
import { Logger } from '../logger/logger.service';
import { ResponseLog } from '../../models/entities/log';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request } from 'express';

@Injectable()
export class Interceptor implements NestInterceptor {
    constructor(private readonly logger: Logger) {}
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> {
        const start: number = Date.now();

        return next.handle().pipe(
            tap((responseData: any) => {
                const end: number = Date.now();
                const responseTime: number = end - start;

                const ctx: HttpArgumentsHost = context.switchToHttp();
                const request: Request = ctx.getRequest();

                const responseLog: ResponseLog = {
                    request,
                    responseData,
                    responseTime,
                };

                logResponse(responseLog, this.logger);
            }),
            map((responseData: any) => {
                if (responseData === undefined) {
                    return {};
                }

                return responseData;
            }),
        );
    }
}
