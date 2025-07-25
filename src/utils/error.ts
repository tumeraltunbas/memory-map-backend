import { HttpStatus, NotFoundException } from '@nestjs/common';
import { ERROR_CODES, ERROR_MESSAGES } from '../constants/error';
import {
    BaseError,
    ErrorResponseBody,
    ValidationError,
} from '../infrastructure/error/error';

export function errorCodeToMessage(errorCode: string): string {
    return ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.process_failure_error;
}

export function createErrorResponseBody<T>(exception: T): ErrorResponseBody {
    const errorResponseBody: ErrorResponseBody = {
        code: ERROR_CODES.PROCESS_FAILURE_ERROR,
        message: errorCodeToMessage(ERROR_CODES.PROCESS_FAILURE_ERROR),
        status: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    if (exception instanceof NotFoundException) {
        errorResponseBody['code'] = ERROR_CODES.NOT_FOUND;
        errorResponseBody['message'] = errorCodeToMessage(
            ERROR_CODES.NOT_FOUND,
        );
        errorResponseBody['status'] = HttpStatus.NOT_FOUND;
    }

    if (exception instanceof BaseError) {
        errorResponseBody['code'] = exception.code;
        errorResponseBody['message'] = errorCodeToMessage(
            errorResponseBody.code,
        );
        errorResponseBody['status'] = exception.status;
    }

    if (exception instanceof ValidationError) {
        errorResponseBody['data'] = exception.data;
    }

    return errorResponseBody;
}
