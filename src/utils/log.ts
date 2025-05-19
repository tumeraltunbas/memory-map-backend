import { requestLogBlackList } from '../constants/log';
import { Logger } from '../infrastructure/logger/logger.service';
import { ResponseLog } from '../models/entities/log';

export function logResponse(responseLog: ResponseLog, logger: Logger): void {
    const {
        request,
        responseData,
        responseTime,
        errorResponseBody,
        exception,
    } = responseLog;

    const ip =
        request?.socket?.remoteAddress ||
        request?.ip ||
        request.headers['x-forwarded-for'];

    const requestLogObject = {
        method: request.method,
        ip,
        url: request.originalUrl,
        body: sanitizeRequestBody(request.body),
    };

    const responseLogObject = {
        data: errorResponseBody ?? responseData,
        responseTime,
    };

    const log = {
        request: requestLogObject,
        response: sanitizeLogObject(responseLogObject),
        error: exception,
    };

    logger.info('Response Log', log);
}

function sanitizeLogObject(logObject: object): object {
    return Object.keys(logObject).length > 0 ? logObject : undefined;
}

function sanitizeRequestBody(body: any): any {
    const clonedBody = structuredClone(body);

    Object.keys(clonedBody).map((k) => {
        if (requestLogBlackList.includes(k)) {
            delete clonedBody[k];
        }
    });

    return clonedBody;
}
