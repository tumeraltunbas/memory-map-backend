import { Injectable } from '@nestjs/common';
import { MarkdownNoteService } from './markdown.note.service';
import { MarkdownNote } from '../../models/entities/markdown-note';
import {
    CreateMarkdownNoteReqDto,
    UpdateMarkdownNoteReqDto,
} from '../../models/dto/req/markdown-note';
import { CreateMarkdownNoteResDto } from '../../models/dto/res/markdown-note';
import { ProcessFailureError } from '../../infrastructure/error/error';
import { Logger } from '../../infrastructure/logger/logger.service';

@Injectable()
export class MarkdownNoteOrchestration {
    constructor(
        private readonly markdownNoteService: MarkdownNoteService,
        private readonly logger: Logger,
    ) {}

    async createMarkdownNote(
        createMarkdownNoteReqDto: CreateMarkdownNoteReqDto,
    ): Promise<CreateMarkdownNoteResDto> {
        const { markdown, text } = createMarkdownNoteReqDto;

        const markdownNote: MarkdownNote = {
            text,
            markdown: markdown,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        let markdownNoteId: string = null;

        try {
            markdownNoteId =
                await this.markdownNoteService.createMarkdownNote(markdownNote);
        } catch (error) {
            this.logger.error(
                'MarkdownNoteOrchestration - createMarkdownNote - createMarkdownNote',
                {
                    error,
                },
            );
            throw new ProcessFailureError(error);
        }

        const createMarkdownNoteResDto: CreateMarkdownNoteResDto = {
            markdownNoteId,
        };

        return createMarkdownNoteResDto;
    }

    async updateMarkdownNote(
        updateMarkdownNoteReqDto: UpdateMarkdownNoteReqDto,
    ): Promise<void> {
        const { markdownNoteId, markdownId, text } = updateMarkdownNoteReqDto;

        const updatedMarkdownNote: Partial<MarkdownNote> = {
            text,
            updatedAt: new Date(),
        };

        try {
            await this.markdownNoteService.updateMarkdownNote(
                markdownNoteId,
                markdownId,
                updatedMarkdownNote,
            );
        } catch (error) {
            this.logger.error(
                'MarkdownNoteOrchestration - updateMarkdownNote - updateMarkdownNote',
                {
                    error,
                },
            );
            throw new ProcessFailureError(error);
        }

        return undefined;
    }
}
