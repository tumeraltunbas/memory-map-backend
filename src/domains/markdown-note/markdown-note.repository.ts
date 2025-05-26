import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MarkdownNote } from '../../models/entities/markdown-note';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class MarkdownNoteRepository {
    constructor(
        @InjectRepository(MarkdownNote)
        private readonly markdownNoteRepository: Repository<MarkdownNote>,
    ) {}

    async createMarkdownNote(markdownNote: MarkdownNote): Promise<string> {
        const result = await this.markdownNoteRepository.insert(markdownNote);
        return result.raw?.at(0)?.id;
    }

    async getMarkdownNoteById(
        markdownNoteId: string,
        markdownId: string,
        userId: string,
    ): Promise<MarkdownNote> {
        const query: FindOneOptions<MarkdownNote> = {
            where: {
                id: markdownNoteId,
                markdown: { id: markdownId, user: { id: userId } },
            },
        };

        return await this.markdownNoteRepository.findOne(query);
    }

    async updateMarkdownNote(
        markdownNoteId: string,
        markdownId: string,
        updatedMarkdownNote: Partial<MarkdownNote>,
    ): Promise<void> {
        const query: FindOptionsWhere<MarkdownNote> = {
            id: markdownNoteId,
            markdown: { id: markdownId },
        };

        await this.markdownNoteRepository.update(query, updatedMarkdownNote);
    }

    async deleteMarkdownNote(
        markdownNoteId: string,
        markdownId: string,
    ): Promise<void> {
        const query: FindOptionsWhere<MarkdownNote> = {
            id: markdownNoteId,
            markdown: { id: markdownId },
        };

        await this.markdownNoteRepository.delete(query);
    }
}
