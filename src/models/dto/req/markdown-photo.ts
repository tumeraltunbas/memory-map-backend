import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../entities/user';

export class UploadMarkdownPhotoDto {
    @IsNotEmpty()
    @IsString()
    markdownId: string;

    files: Express.Multer.File[];
    user: User;
}
