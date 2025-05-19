import { Injectable } from '@nestjs/common';
import {
    createLogger,
    Logger as WinstonLogger,
    format,
    transports,
} from 'winston';

const logFormat = format.printf(({ level, message, ...metadata }) => {
    const mappedError = {};

    if (metadata?.error) {
        if (metadata.error['stack']) {
            mappedError['stack'] = metadata.error['stack'];
        }

        if (metadata.error['cause']) {
            mappedError['cause'] = metadata.error['cause'];
        }

        if (metadata.error['message']) {
            mappedError['message'] = metadata.error['message'];
        }

        metadata.error = mappedError;
    }

    return JSON.stringify({
        level,
        message,
        date: new Date(),
        metadata: Object.keys(metadata)?.length > 0 ? metadata : undefined,
    });
});

@Injectable()
export class Logger {
    private readonly logger: WinstonLogger;
    constructor() {
        this.logger = createLogger({
            format: logFormat,
            transports: [new transports.Console()],
        });
    }

    log(message: string, metadata?: object) {
        this.logger.info(message, metadata);
    }

    info(message: string, metadata?: object) {
        this.logger.info(message, metadata);
    }

    error(message: string, metadata?: object) {
        this.logger.error(message, metadata);
    }

    warn(message: string, metadata?: object) {
        this.logger.warn(message, metadata);
    }
}
