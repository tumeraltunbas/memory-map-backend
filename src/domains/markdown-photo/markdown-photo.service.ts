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

    async deleteMarkdownPhoto(
        markdownPhotoId: string,
        markdownId: string,
    ): Promise<void> {
        await this.markdownPhotoRepository.deleteMarkdownPhoto(
            markdownPhotoId,
            markdownId,
        );
    }

    async getMarkdownPhotoById(
        markdownPhotoId: string,
        markdownId: string,
        userId: string,
    ): Promise<MarkdownPhoto> {
        return await this.markdownPhotoRepository.getMarkdownPhotoById(
            markdownPhotoId,
            markdownId,
            userId,
        );
    }
}
