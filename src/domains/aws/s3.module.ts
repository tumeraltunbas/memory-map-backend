import { ConfigModule, ConfigService } from '@nestjs/config';
import { CONFIGURATION_KEYS } from '../../constants/configuration';
import { Module } from '@nestjs/common';
import { S3Instance } from '../../infrastructure/aws/aws';
import INFRASTRUCTURE_PROVIDERS from '../../constants/infrastructure';
import { AwsConfig } from '../../config/configuration';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: INFRASTRUCTURE_PROVIDERS.S3_INSTANCE,
            useFactory: (configService: ConfigService) => {
                const awsConfig = configService.get<AwsConfig>(
                    CONFIGURATION_KEYS.aws,
                );
                return new S3Instance(awsConfig);
            },
            inject: [ConfigService],
        },
    ],
    exports: [INFRASTRUCTURE_PROVIDERS.S3_INSTANCE],
})
export class AwsS3Module {}
