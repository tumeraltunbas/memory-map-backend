import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Markdown } from '../../models/entities/markdown';
import {
    FindManyOptions,
    FindOneOptions,
    FindOptionsWhere,
    Repository,
} from 'typeorm';

@Injectable()
export class MarkdownRepository {
    constructor(
        @InjectRepository(Markdown)
        private readonly markdownRepository: Repository<Markdown>,
    ) {}

    async insertMarkdown(markdown: Markdown): Promise<string> {
        const result = await this.markdownRepository.insert(markdown);
        return result.raw?.at(0)?.id;
    }

    async getMarkdownByGeoLocation(coordinates: number[]): Promise<Markdown> {
        return this.markdownRepository
            .createQueryBuilder('markdown')
            .where('markdown.geoLocation ~= point(:lng, :lat)', {
                lng: coordinates[0],
                lat: coordinates[1],
            })
            .getOne();
    }

    async getMarkdowns(userId: string): Promise<Markdown[]> {
        const query: FindManyOptions<Markdown> = {
            where: {
                user: { id: userId },
            },
        };

        return this.markdownRepository.find(query);
    }

    async getMarkdownById(
        markdownId: string,
        userId: string,
        withPhotos?: boolean,
        withNotes?: boolean,
    ): Promise<Markdown> {
        const relations: string[] = [];

        if (withPhotos) {
            relations.push('photos');
        }

        if (withNotes) {
            relations.push('notes');
        }

        const query: FindOneOptions<Markdown> = {
            where: {
                user: { id: userId },
                id: markdownId,
            },
            relations: relations,
        };

        return this.markdownRepository.findOne(query);
    }

    async deleteMarkdown(markdownId: string, userId: string): Promise<void> {
        const query: FindOptionsWhere<Markdown> = {
            id: markdownId,
            user: { id: userId },
        };

        await this.markdownRepository.delete(query);
    }

    async updateMarkdown(
        markdownId: string,
        userId: string,
        markdown: Partial<Markdown>,
    ): Promise<void> {
        const query: FindOptionsWhere<Markdown> = {
            id: markdownId,
            user: { id: userId },
        };

        await this.markdownRepository.update(query, markdown);
    }
}
