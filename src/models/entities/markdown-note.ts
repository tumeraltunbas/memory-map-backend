import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DATABASE_TABLE_NAMES } from '../../constants/database';
import { Markdown } from './markdown';

@Entity(DATABASE_TABLE_NAMES.MARKDOWN_NOTES)
export class MarkdownNote {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column('varchar')
    text: string;

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

    @ManyToOne(() => Markdown, (markdown) => markdown.notes)
    markdown: Markdown;
}
