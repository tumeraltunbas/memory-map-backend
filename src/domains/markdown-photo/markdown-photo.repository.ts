import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MarkdownPhoto } from '../../models/entities/markdown-photo';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class MarkdownPhotoRepository {
    constructor(
        @InjectRepository(MarkdownPhoto)
        private readonly markdownPhotoRepository: Repository<MarkdownPhoto>,
    ) {}

    async createMarkdownPhotos(markdownPhotos: MarkdownPhoto[]): Promise<void> {
        await this.markdownPhotoRepository.insert(markdownPhotos);
    }

    async deleteMarkdownPhoto(
        markdownPhotoId: string,
        markdownId: string,
    ): Promise<void> {
        const query: FindOptionsWhere<MarkdownPhoto> = {
            id: markdownPhotoId,
            markdown: { id: markdownId },
        };

        await this.markdownPhotoRepository.delete(query);
    }

    async getMarkdownPhotoById(
        markdownPhotoId: string,
        markdownId: string,
        userId: string,
    ): Promise<MarkdownPhoto> {
        const query: FindOneOptions<MarkdownPhoto> = {
            where: {
                id: markdownPhotoId,
                markdown: { id: markdownId, user: { id: userId } },
            },
        };

        return await this.markdownPhotoRepository.findOne(query);
    }
}
