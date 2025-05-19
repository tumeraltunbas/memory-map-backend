import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './infrastructure/error/exception-filter';
import { Logger } from './infrastructure/logger/logger.service';
import { Interceptor } from './infrastructure/interceptors/interceptor';
import { ConfigService } from '@nestjs/config';
import { CONFIGURATION_KEYS } from './constants/configuration';
import { ValidationPipe } from '@nestjs/common';
import { getValidationPipeOptions } from './infrastructure/validation/validation';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const logger = app.get(Logger);
    const configService = app.get(ConfigService);

    app.useLogger(logger);
    app.useGlobalFilters(new AllExceptionFilter(logger));
    app.useGlobalInterceptors(new Interceptor(logger));
    app.useGlobalPipes(new ValidationPipe(getValidationPipeOptions()));
    app.use(cookieParser());

    app.enableCors({
        origin: configService.get<string>(CONFIGURATION_KEYS.path.webBaseUrl),
        credentials: true,
    });

    const port: number = configService.get<number>(CONFIGURATION_KEYS.app.port);

    await app.listen(port);
}
bootstrap();
