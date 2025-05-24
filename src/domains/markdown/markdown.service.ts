import { Injectable } from '@nestjs/common';
import { MarkdownRepository } from './markdown.repository';
import { Markdown } from '../../models/entities/markdown';

@Injectable()
export class MarkdownService {
    constructor(private readonly markdownRepository: MarkdownRepository) {}

    async insertMarkdown(markdown: Markdown): Promise<string> {
        return await this.markdownRepository.insertMarkdown(markdown);
    }

    getMarkdownByGeoLocation(coordinates: number[]): Promise<Markdown> {
        return this.markdownRepository.getMarkdownByGeoLocation(coordinates);
    }

    getMarkdowns(userId: string): Promise<Markdown[]> {
        return this.markdownRepository.getMarkdowns(userId);
    }

    getMarkdownById(
        markdownId: string,
        userId: string,
        withPhotos?: boolean,
        withNotes?: boolean,
    ): Promise<Markdown> {
        return this.markdownRepository.getMarkdownById(
            markdownId,
            userId,
            withPhotos,
            withNotes,
        );
    }

    async deleteMarkdown(markdownId: string, userId: string): Promise<void> {
        return await this.markdownRepository.deleteMarkdown(markdownId, userId);
    }
}
