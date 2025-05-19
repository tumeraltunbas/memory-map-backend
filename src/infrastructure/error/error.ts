import { HttpStatus } from '@nestjs/common';
import { ERROR_CODES } from '../../constants/error';

export class BaseError extends Error {
    status: number;
    code: string;
    cause: Error | undefined;

    constructor(status: number, code: string, cause?: Error) {
        super();
        this.status = status;
        this.code = code;
        this.cause = cause;
    }
}

export class ProcessFailureError extends BaseError {
    constructor(cause: Error) {
        super(
            HttpStatus.INTERNAL_SERVER_ERROR,
            ERROR_CODES.processFailureError,
            cause,
        );
    }
}

export class BusinessRuleError extends BaseError {
    constructor(code: string) {
        super(HttpStatus.UNPROCESSABLE_ENTITY, code);
    }
}

export class ValidationError extends BaseError {
    data: ValidationErrorData[];
    constructor(data: ValidationErrorData[]) {
        super(HttpStatus.BAD_REQUEST, ERROR_CODES.validationError);
        this.data = data;
    }
}

export interface ErrorResponseBody {
    code: string;
    message: string;
    status: number;
    data?: any;
}

export interface ValidationErrorData {
    field: string;
    messages: string[];
}
