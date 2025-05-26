import {
    Injectable,
    PipeTransform,
    ValidationPipeOptions,
} from '@nestjs/common';
import {
    BusinessRuleError,
    ValidationError,
    ValidationErrorData,
} from '../error/error';
import configuration from '../../config/configuration';
import { ERROR_CODES } from '../../constants/error';

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

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
    transform(value: Express.Multer.File[]): Express.Multer.File[] {
        const maxFileSize = configuration().markdown.maxFileSize;

        for (const file of value) {
            if (file.size > maxFileSize) {
                throw new BusinessRuleError(ERROR_CODES.fileSizeExceeded);
            }
        }

        return value;
    }
}

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
    transform(value: Express.Multer.File[]): Express.Multer.File[] {
        const allowedTypes = configuration().markdown.allowedFileTypes;

        for (const file of value) {
            if (!allowedTypes.includes(file.mimetype)) {
                throw new BusinessRuleError(ERROR_CODES.fileTypeInvalid);
            }
        }

        return value;
    }
}
