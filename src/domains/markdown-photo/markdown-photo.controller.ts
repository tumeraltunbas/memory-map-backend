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
import {
    DeleteMarkdownPhotoDto,
    UploadMarkdownPhotoDto,
} from '../../models/dto/req/markdown-photo';
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

    @Post(MARKDOWN_PHOTO_ROUTES.DELETE)
    async deleteMarkdownPhoto(
        @Req() req: CustomRequest,
        @Body() deleteMarkdownPhotoDto: DeleteMarkdownPhotoDto,
    ) {
        deleteMarkdownPhotoDto.markdownPhoto = req.markdownPhoto;
        deleteMarkdownPhotoDto.markdown = req.markdown;

        return await this.markdownPhotoOrchestration.deleteMarkdownPhoto(
            deleteMarkdownPhotoDto,
        );
    }
}
