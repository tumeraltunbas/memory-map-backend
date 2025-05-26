import {
    Body,
    Controller,
    Post,
    Req,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { MARKDOWN_PHOTO_ROUTES } from '../../constants/prefix';
import { MarkdownPhotoOrchestration } from './markdown-photo.orchestration';
import { UploadMarkdownPhotoDto } from '../../models/dto/req/markdown-photo';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CustomRequest } from '../../models/entities/request';
import {
    FileSizeValidationPipe,
    FileTypeValidationPipe,
} from '../../infrastructure/validation/validation';

@Controller(MARKDOWN_PHOTO_ROUTES.BASE)
export class MarkdownPhotoController {
    constructor(
        private readonly markdownPhotoOrchestration: MarkdownPhotoOrchestration,
    ) {}

    @Post(MARKDOWN_PHOTO_ROUTES.CREATE)
    @UseInterceptors(FilesInterceptor('files'))
    async uploadMarkdownPhoto(
        @UploadedFiles(
            new FileSizeValidationPipe(),
            new FileTypeValidationPipe(),
        )
        files: Express.Multer.File[],
        @Req() req: CustomRequest,
        @Body() uploadMarkdownPhotoDto: UploadMarkdownPhotoDto,
    ) {
        uploadMarkdownPhotoDto.files = files;
        uploadMarkdownPhotoDto.user = req.user;

        return await this.markdownPhotoOrchestration.uploadMarkdownPhoto(
            uploadMarkdownPhotoDto,
        );
    }
}
