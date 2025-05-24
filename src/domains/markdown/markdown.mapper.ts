import { Injectable } from '@nestjs/common';
import { GetMarkdownsResDto } from '../../models/dto/res/markdown';
import { Markdown } from '../../models/entities/markdown';

@Injectable()
export class MarkdownMapper {
    mapMarkdowns(markdowns: Markdown[]): GetMarkdownsResDto {
        const getMarkdownsResDto: GetMarkdownsResDto = {
            markdowns: markdowns.map((m) => ({
                markdownId: m.id,
                title: m.title,
                geoLocation: m.geoLocation,
                createdAt: m.createdAt,
                updatedAt: m.updatedAt,
            })),
        };

        return getMarkdownsResDto;
    }
}
