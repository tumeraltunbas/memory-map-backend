import { Injectable } from '@nestjs/common';
import { MarkdownPhotoRepository } from './markdown-photo.repository';
import { MarkdownPhoto } from '../../models/entities/markdown-photo';

@Injectable()
export class MarkdownPhotoService {
    constructor(
        private readonly markdownPhotoRepository: MarkdownPhotoRepository,
    ) {}

    async createMarkdownPhotos(markdownPhotos: MarkdownPhoto[]): Promise<void> {
        await this.markdownPhotoRepository.createMarkdownPhotos(markdownPhotos);
    }
}
