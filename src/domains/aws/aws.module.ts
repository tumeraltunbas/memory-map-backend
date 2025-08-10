import { ConfigModule, ConfigService } from '@nestjs/config';
import { CONFIGURATION_KEYS } from '../../constants/configuration';
import { Module } from '@nestjs/common';
import { AwsInstance } from '../../infrastructure/aws/aws';
import INFRASTRUCTURE_PROVIDERS from '../../constants/infrastructure';
import { AwsConfig } from '../../config/configuration';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: INFRASTRUCTURE_PROVIDERS.AWS_INSTANCE,
            useFactory: (configService: ConfigService) => {
                const awsConfig = configService.get<AwsConfig>(
                    CONFIGURATION_KEYS.aws,
                );
                return new AwsInstance(awsConfig);
            },
            inject: [ConfigService],
        },
    ],
    exports: [INFRASTRUCTURE_PROVIDERS.AWS_INSTANCE],
})
export class AwsS3Module {}
