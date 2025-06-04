import { Body, Controller, Patch, Post, Req } from '@nestjs/common';
import { MARKDOWN_NOTE_ROUTES } from '../../constants/prefix';
import { MarkdownNoteOrchestration } from './markdow-note.orchestration';
import { CustomRequest } from '../../models/entities/request';
import {
    CreateMarkdownNoteReqDto,
    DeleteMarkdownNoteReqDto,
    UpdateMarkdownNoteReqDto,
} from '../../models/dto/req/markdown-note';
import { CreateMarkdownNoteResDto } from '../../models/dto/res/markdown-note';

@Controller(MARKDOWN_NOTE_ROUTES.BASE)
export class MarkdownNoteController {
    constructor(
        private readonly markdownNoteOrchestration: MarkdownNoteOrchestration,
    ) {}

    @Post(MARKDOWN_NOTE_ROUTES.CREATE)
    async createMarkdownNote(
        @Req() req: CustomRequest,
        @Body() createMarkdownNoteReqDto: CreateMarkdownNoteReqDto,
    ): Promise<CreateMarkdownNoteResDto> {
        createMarkdownNoteReqDto.markdown = req.markdown;

        return this.markdownNoteOrchestration.createMarkdownNote(
            createMarkdownNoteReqDto,
        );
    }

    @Patch(MARKDOWN_NOTE_ROUTES.UPDATE)
    async updateMarkdownNote(
        @Req() req: CustomRequest,
        @Body() updateMarkdownNoteReqDto: UpdateMarkdownNoteReqDto,
    ): Promise<void> {
        updateMarkdownNoteReqDto.markdownNote = req.markdownNote;

        await this.markdownNoteOrchestration.updateMarkdownNote(
            updateMarkdownNoteReqDto,
        );

        return undefined;
    }

    @Post(MARKDOWN_NOTE_ROUTES.DELETE)
    async deleteMarkdownNote(
        @Req() req: CustomRequest,
        @Body() deleteMarkdownNoteReqDto: DeleteMarkdownNoteReqDto,
    ): Promise<void> {
        deleteMarkdownNoteReqDto.markdownNote = req.markdownNote;

        await this.markdownNoteOrchestration.deleteMarkdownNote(
            deleteMarkdownNoteReqDto,
        );

        return undefined;
    }
}
