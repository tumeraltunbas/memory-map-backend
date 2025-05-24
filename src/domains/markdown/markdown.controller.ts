import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
} from '@nestjs/common';
import { MARKDOWN_ROUTES } from '../../constants/prefix';
import { MarkdownOrchestration } from './markdown.orchestration';
import {
    CreateMarkdownReqDto,
    DeleteMarkdownReqDto,
    GetMarkdownReqDto,
    GetMarkdownsReqDto,
    UpdateMarkdownReqDto,
} from '../../models/dto/req/markdown';
import {
    CreateMarkdownResDto,
    GetMarkdownResDto,
    GetMarkdownsResDto,
} from '../../models/dto/res/markdown';
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

        return await this.markdownOrchestration.getMarkdowns(
            getMarkdownsReqDto,
        );
    }

    @Delete(MARKDOWN_ROUTES.DELETE)
    async deleteMarkdown(
        @Req() req: CustomRequest,
        @Param('markdownId') markdownId: string,
    ): Promise<void> {
        const deleteMarkdownReqDto: DeleteMarkdownReqDto = {
            markdownId,
            user: req.user,
        };

        await this.markdownOrchestration.deleteMarkdown(deleteMarkdownReqDto);
        return undefined;
    }

    @Get(MARKDOWN_ROUTES.GET_SINGLE)
    async getMarkdown(
        @Req() req: CustomRequest,
        @Param('markdownId') markdownId: string,
    ): Promise<GetMarkdownResDto> {
        const getMarkdownReqDto: GetMarkdownReqDto = {
            markdownId,
            user: req.user,
        };

        return await this.markdownOrchestration.getMarkdown(getMarkdownReqDto);
    }

    @Patch(MARKDOWN_ROUTES.UPDATE)
    async updateMarkdown(
        @Req() req: CustomRequest,
        @Param('markdownId') markdownId: string,
        @Body() updateMarkdownReqDto: UpdateMarkdownReqDto,
    ): Promise<void> {
        updateMarkdownReqDto.user = req.user;
        updateMarkdownReqDto.markdownId = markdownId;

        return await this.markdownOrchestration.updateMarkdown(
            updateMarkdownReqDto,
        );
    }
}
