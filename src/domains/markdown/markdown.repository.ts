import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Markdown } from '../../models/entities/markdown';
import { FindManyOptions, FindOptions, Repository } from 'typeorm';

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
}
