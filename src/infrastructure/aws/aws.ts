import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import {
    SESClient,
    SendTemplatedEmailCommand,
    SendEmailCommand,
} from '@aws-sdk/client-ses';
import { AwsConfig } from '../../config/configuration';
import { randomUUID } from 'crypto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class AwsInstance {
    private readonly s3Client: S3Client;
    private readonly sesClient: SESClient;

    constructor(private readonly awsConfig: AwsConfig) {
        this.s3Client = new S3Client({
            region: this.awsConfig.region,
            credentials: {
                accessKeyId: this.awsConfig.accessKey,
                secretAccessKey: this.awsConfig.secretAccessKey,
            },
        });

        this.sesClient = new SESClient({
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

    async sendResetPasswordEmail(
        toEmail: string,
        resetUrl: string,
    ): Promise<void> {
        const subject = 'Reset your password';
        const bodyHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">Hello,</h2>
                    <p style="font-size: 16px; color: #555;">
                    We received a request to reset your password.  
                    Click the button below to set a new one:
                    </p>
                    <p style="text-align: center;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 12px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                        Reset Password
                    </a>
                    </p>
                    <p style="font-size: 14px; color: #999;">
                    If you did not request a password reset, you can safely ignore this email.
                    </p>
                </div>
                `;

        const command = new SendEmailCommand({
            Source: this.awsConfig.sesSenderEmail,
            Destination: { ToAddresses: [toEmail] },
            Message: {
                Subject: { Data: subject },
                Body: { Html: { Data: bodyHtml } },
            },
        });
        await this.sesClient.send(command);
    }
}
