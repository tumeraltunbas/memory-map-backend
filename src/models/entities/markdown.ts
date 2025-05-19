import {
    Column,
    Entity,
    ManyToOne,
    Point,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { DATABASE_TABLE_NAMES } from '../../constants/database';
import { User } from './user';

@Entity(DATABASE_TABLE_NAMES.MARKDOWNS)
export class Markdown {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column('varchar')
    title: string;

    @Column({ type: 'point' })
    geoLocation: Point;

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

    @ManyToOne(() => User, (user) => user.markdowns)
    user: User;
}
