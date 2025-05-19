import { ConfigModule } from '@nestjs/config';
import configuration, { DatabaseConfig } from '../config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicModule } from '@nestjs/common';
import { DATABASE_TYPES } from '../constants/enum';
import { User } from '../models/entities/user';
import { UserToken } from '../models/entities/user-token';
import { Markdown } from '../models/entities/markdown';

export const loadConfigModule = (): Promise<DynamicModule> => {
    return ConfigModule.forRoot({
        isGlobal: true,
        skipProcessEnv: true,
        load: [configuration],
    });
};

export const loadTypeOrmModule = (): DynamicModule => {
    const databaseConfig: DatabaseConfig = configuration().database;

    return TypeOrmModule.forRoot({
        type: DATABASE_TYPES[databaseConfig.type],
        host: databaseConfig.host,
        port: databaseConfig.port,
        username: databaseConfig.username,
        password: databaseConfig.password,
        database: databaseConfig.name,
        entities: [User, UserToken, Markdown],
        synchronize: databaseConfig.synchronize,
    });
};
