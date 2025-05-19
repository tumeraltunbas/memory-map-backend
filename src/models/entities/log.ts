import { Request } from 'express';
import { ErrorResponseBody } from '../../infrastructure/error/error';

export interface ResponseLog {
    request: Request;
    responseData?: any;
    responseTime?: number;
    errorResponseBody?: ErrorResponseBody;
    exception?: any;
}
