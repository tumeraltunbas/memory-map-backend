import {
    Column,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user';
import { DATABASE_TABLE_NAMES } from '../../constants/database';

@Entity(DATABASE_TABLE_NAMES.PASSWORD_RESET_TOKENS)
export class PasswordResetToken {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @ManyToOne(() => User, (user) => user.resetPasswordTokens, {
        onDelete: 'CASCADE',
    })
    user: User;

    @Index()        
    @Column({ type: 'varchar', unique: true })
    token: string;

    @Column({ type: 'timestamp without time zone' })
    expiresAt: Date;

    @Column({ type: 'timestamp without time zone', nullable: true })
    usedAt?: Date;

    @Column({
        type: 'timestamp without time zone',
        default: new Date(),
    })
    createdAt?: Date;

    constructor(user: User, token: string, expiresAt: Date) {
        this.user = user;
        this.token = token;
        this.expiresAt = expiresAt;
        this.createdAt = new Date();
    }
}
