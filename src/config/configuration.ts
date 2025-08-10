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
        passwordResetTokenExpiresIn: 1000 * 60 * 30,
    },

    path: {
        serverBaseUrl: process.env.SERVER_BASE_URL,
        webBaseUrl: process.env.WEB_BASE_URL,
    },

    aws: {
        accessKey: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        bucketName: process.env.AWS_S3_BUCKET_NAME,
        presignedUrlExpiresIn: 60 * 60,
        sesSenderEmail: process.env.AWS_SES_SENDER_EMAIL,
    },

    markdown: {
        maxFileSize: 5 * 1024 * 1024,
        allowedFileTypes: [
            'image/jpg',
            'image/png',
            'image/jpeg',
            'image/webp',
            'application/pdf',
            'video/mp4',
            'video/mov',
        ],
        maxFileCount: 5,
    },

    mapbox: {
        accessToken: process.env.MAPBOX_ACCESS_TOKEN,
        reverseGeocodeUrl: 'https://api.mapbox.com/search/geocode/v6/reverse',
    },
});

interface Config {
    app: AppConfig;
    database: DatabaseConfig;
    security: SecurityConfig;
    path: PathConfig;
    aws: AwsConfig;
    markdown: MarkdownConfig;
    mapbox: MapboxConfig;
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
    passwordResetTokenExpiresIn: number;
}

export interface PathConfig {
    serverBaseUrl: string;
    webBaseUrl: string;
}

export interface AwsConfig {
    accessKey: string;
    secretAccessKey: string;
    region: string;
    bucketName: string;
    presignedUrlExpiresIn: number;
    sesSenderEmail: string;
}

export interface MarkdownConfig {
    maxFileSize: number;
    allowedFileTypes: string[];
    maxFileCount: number;
}

export interface MapboxConfig {
    accessToken: string;
    reverseGeocodeUrl: string;
}
