import { Controller } from '@nestjs/common';
import { MARKDOWN_PHOTO_ROUTES } from '../../constants/prefix';
import { MarkdownPhotoOrchestration } from './markdown-photo.orchestration';

@Controller(MARKDOWN_PHOTO_ROUTES.BASE)
export class MarkdownPhotoController {
    constructor(
        private readonly markdownPhotoOrchestration: MarkdownPhotoOrchestration,
    ) {}
}
