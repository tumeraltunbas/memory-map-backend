import { Injectable } from '@nestjs/common';
import {
    GetMarkdownResDto,
    GetMarkdownsResDto,
} from '../../models/dto/res/markdown';
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

    mapMarkdown(
        markdown: Markdown,
        presignedUrls: { id: string; url: string }[],
    ): GetMarkdownResDto {
        const getMarkdownResDto: GetMarkdownResDto = {
            markdownId: markdown.id,
            title: markdown.title,
            geoLocation: markdown.geoLocation,
            photos: presignedUrls.map((photo) => ({
                id: photo.id,
                url: photo.url,
            })),
            notes: markdown.notes.map((note) => ({
                id: note.id,
                text: note.text,
            })),
            createdAt: markdown.createdAt,
            updatedAt: markdown.updatedAt,
        };

        return getMarkdownResDto;
    }
}
