import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { AwsConfig } from '../../config/configuration';
import { randomUUID } from 'crypto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class S3Instance {
    private readonly s3Client: S3Client;

    constructor(private readonly awsConfig: AwsConfig) {
        this.s3Client = new S3Client({
            region: this.awsConfig.region,
            credentials: {
                accessKeyId: this.awsConfig.accessKey,
                secretAccessKey: this.awsConfig.secretAccessKey,
            },
        });
    }

    async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
        const fileNames: string[] = [];

        const uploadPromises = files.map((file) => {
            const fileName = randomUUID() + file.originalname;

            const command = new PutObjectCommand({
                Bucket: this.awsConfig.bucketName,
                Key: fileName,
                Body: file.buffer,
            });

            fileNames.push(fileName);
            return this.s3Client.send(command);
        });

        await Promise.all(uploadPromises);

        return fileNames;
    }

    async getPresignedUrl(fileName: string): Promise<string> {
        const command: GetObjectCommand = new GetObjectCommand({
            Key: fileName,
            Bucket: this.awsConfig.bucketName,
        });

        const presignedUrl: string = await getSignedUrl(
            this.s3Client,
            command,
            { expiresIn: this.awsConfig.presignedUrlExpiresIn },
        );

        return presignedUrl;
    }
}
