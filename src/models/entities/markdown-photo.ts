import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DATABASE_TABLE_NAMES } from '../../constants/database';
import { Markdown } from './markdown';

@Entity(DATABASE_TABLE_NAMES.MARKDOWN_PHOTOS)
export class MarkdownPhoto {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column('varchar')
    fileName: string;

    @Column({
        type: 'timestamp without time zone',
        default: new Date(),
    })
    createdAt: Date;

    @Column({
        type: 'timestamp without time zone',
        default: new Date(),
    })
    updatedAt: Date;

    @ManyToOne(() => Markdown, (markdown) => markdown.photos)
    markdown: Markdown;
}
