import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { MARKDOWN_ROUTES } from '../../constants/prefix';
import { MarkdownOrchestration } from './markdown.orchestration';
import { CreateMarkdownReqDto, GetMarkdownsReqDto } from '../../models/dto/req/markdown';
import { CreateMarkdownResDto, GetMarkdownsResDto } from '../../models/dto/res/markdown';
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

    @Get(MARKDOWN_ROUTES.GET_ALL)
    async getMarkdowns(@Req() req: CustomRequest): Promise<GetMarkdownsResDto> {
        const getMarkdownsReqDto: GetMarkdownsReqDto = {
            user: req.user,
        };

        return await this.markdownOrchestration.getMarkdowns(getMarkdownsReqDto);
    }
}
