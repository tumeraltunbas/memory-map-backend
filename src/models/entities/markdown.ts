import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { DATABASE_TABLE_NAMES } from '../../constants/database';
import { User } from './user';
import { MarkdownPhoto } from './markdown-photo';
import { MarkdownNote } from './markdown-note';

@Entity(DATABASE_TABLE_NAMES.MARKDOWNS)
export class Markdown {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column('varchar')
    title: string;

    @Column({ type: 'point' })
    geoLocation: Point | string;

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

    @ManyToOne(() => User, (user) => user.markdowns, {
        onDelete: 'CASCADE',
    })
    user: User;

    @OneToMany(() => MarkdownPhoto, (markdownPhoto) => markdownPhoto.markdown)
    photos?: MarkdownPhoto[];

    @OneToMany(() => MarkdownNote, (markdownNote) => markdownNote.markdown)
    notes?: MarkdownNote[];
}

export type Point = {
    x: number;
    y: number;
};
