import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';
import { DATABASE_TABLE_NAMES } from '../../constants/database';

@Entity(DATABASE_TABLE_NAMES.USER_TOKENS)
export class UserToken {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @ManyToOne(() => User, (user) => user.userTokens)
    user: User;

    @Column({ type: 'varchar' })
    accessToken: string;

    @Column({ type: 'varchar' })
    refreshToken: string;

    @Column({ type: 'timestamp without time zone', default: new Date() })
    createdAt: Date;

    @Column({ type: 'timestamp without time zone', default: new Date() })
    updatedAt: Date;

    @Column({ type: 'bool', default: false })
    isRevoked: boolean;

    constructor(user: User, accessToken: string, refreshToken: string) {
        this.user = user;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.isRevoked = false;
    }
}
