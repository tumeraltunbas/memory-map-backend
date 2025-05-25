import { Injectable } from '@nestjs/common';
import { MarkdownPhotoRepository } from './markdown-photo.repository';

@Injectable()
export class MarkdownPhotoService {
    constructor(
        private readonly markdownPhotoRepository: MarkdownPhotoRepository,
    ) {}
}
