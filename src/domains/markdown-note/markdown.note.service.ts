import { Injectable } from '@nestjs/common';
import { MarkdownNoteRepository } from './markdown-note.repository';
import { MarkdownNote } from '../../models/entities/markdown-note';

@Injectable()
export class MarkdownNoteService {
    constructor(
        private readonly markdownNoteRepository: MarkdownNoteRepository,
    ) {}

    async createMarkdownNote(markdownNote: MarkdownNote): Promise<string> {
        return await this.markdownNoteRepository.createMarkdownNote(
            markdownNote,
        );
    }

    async getMarkdownNoteById(
        markdownNoteId: string,
        markdownId: string,
    ): Promise<MarkdownNote> {
        return await this.markdownNoteRepository.getMarkdownNoteById(
            markdownNoteId,
            markdownId,
        );
    }

    async updateMarkdownNote(
        markdownNoteId: string,
        markdownId: string,
        updatedMarkdownNote: Partial<MarkdownNote>,
    ): Promise<void> {
        return await this.markdownNoteRepository.updateMarkdownNote(
            markdownNoteId,
            markdownId,
            updatedMarkdownNote,
        );
    }

    async deleteMarkdownNote(
        markdownNoteId: string,
        markdownId: string,
    ): Promise<void> {
        return await this.markdownNoteRepository.deleteMarkdownNote(
            markdownNoteId,
            markdownId,
        );
    }
}
