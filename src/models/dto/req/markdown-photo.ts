import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../entities/user';
import { MarkdownPhoto } from '../../entities/markdown-photo';

export class UploadMarkdownPhotoDto {
    @IsNotEmpty()
    @IsString()
    markdownId: string;

    files: Express.Multer.File[];
    user: User;
}

export class DeleteMarkdownPhotoDto {
    @IsNotEmpty()
    @IsString()
    markdownId: string;

    user: User;
    markdownPhoto: MarkdownPhoto;
}
