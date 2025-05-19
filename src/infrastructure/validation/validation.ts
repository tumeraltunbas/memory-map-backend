import { ValidationPipeOptions } from '@nestjs/common';
import { ValidationError, ValidationErrorData } from '../error/error';

export const getValidationPipeOptions = (): ValidationPipeOptions => {
    return {
        whitelist: true,
        exceptionFactory(errors): ValidationError {
            const validationErrors: ValidationErrorData[] = [];

            for (const error of errors) {
                validationErrors.push({
                    field: error.property,
                    messages: Object.values(error.constraints),
                });
            }

            return new ValidationError(validationErrors);
        },
    };
};
