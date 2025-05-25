import { Body, Controller, Post, Req } from '@nestjs/common';
import { MARKDOWN_NOTE_ROUTES } from '../../constants/prefix';
import { MarkdownNoteOrchestration } from './markdow-note.orchestration';
import { CustomRequest } from '../../models/entities/request';
import { CreateMarkdownNoteReqDto } from '../../models/dto/req/markdown-note';
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
}
