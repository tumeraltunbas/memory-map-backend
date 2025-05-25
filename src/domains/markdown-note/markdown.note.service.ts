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
}
