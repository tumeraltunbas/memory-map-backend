import { Body, Controller, Post, Req } from '@nestjs/common';
import { MARKDOWN_ROUTES } from '../../constants/prefix';
import { MarkdownOrchestration } from './markdown.orchestration';
import { CreateMarkdownReqDto } from '../../models/dto/req/markdown';
import { CreateMarkdownResDto } from '../../models/dto/res/markdown';
import { CustomRequest } from '../../models/entities/request';

@Controller(MARKDOWN_ROUTES.BASE)
export class MarkdownController {
    constructor(
        private readonly markdownOrchestration: MarkdownOrchestration,
    ) {}

    @Post(MARKDOWN_ROUTES.CREATE)
    async createMarkdown(
        @Req() req: CustomRequest,
        @Body() createMarkdownReqDto: CreateMarkdownReqDto,
    ): Promise<CreateMarkdownResDto> {
        createMarkdownReqDto.user = req.user;

        return await this.markdownOrchestration.createMarkdown(
            createMarkdownReqDto,
        );
    }
}
