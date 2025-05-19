import { NODE_ENVIRONMENTS } from '../constants/enum';

export default (): Config => ({
    app: {
        port: parseInt(process.env.PORT) || 8080,
        nodeEnv: process.env.NODE_ENV,
    },
    database: {
        type: process.env.DB_TYPE,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
        synchronize:
            (process.env.NODE_ENV as NODE_ENVIRONMENTS) ==
            NODE_ENVIRONMENTS.PRODUCTION
                ? false
                : true,
    },
    security: {
        hashRounds: 12,
        jwt: {
            secretKey: process.env.JWT_SECRET_KEY,
            accessTokenHeaderName: process.env.ACCESS_TOKEN_HEADER_NAME,
            accessTokenExpiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN),
            refreshTokenExpiresIn: parseInt(
                process.env.REFRESH_TOKEN_EXPIRES_IN,
            ),
            issuer: process.env.SERVER_BASE_URL,
            audience: process.env.WEB_BASE_URL,
        },
    },
    path: {
        serverBaseUrl: process.env.SERVER_BASE_URL,
        webBaseUrl: process.env.WEB_BASE_URL,
    },
});

interface Config {
    app: AppConfig;
    database: DatabaseConfig;
    security: SecurityConfig;
    path: PathConfig;
}

export interface AppConfig {
    port: number;
    nodeEnv: string;
}

export interface DatabaseConfig {
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
    synchronize: boolean;
}

export interface SecurityConfig {
    hashRounds: number;
    jwt: {
        secretKey: string;
        accessTokenHeaderName: string;
        accessTokenExpiresIn: number;
        refreshTokenExpiresIn: number;
        issuer: string;
        audience: string;
    };
}

export interface PathConfig {
    serverBaseUrl: string;
    webBaseUrl: string;
}
