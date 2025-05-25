import { Injectable } from '@nestjs/common';
import { MarkdownPhotoService } from './markdown-photo.service';

@Injectable()
export class MarkdownPhotoOrchestration {
    constructor(private readonly markdownPhotoService: MarkdownPhotoService) {}
}
