import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserToken } from './user-token';
import { DATABASE_TABLE_NAMES } from '../../constants/database';

@Entity(DATABASE_TABLE_NAMES.USERS)
export class User {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column({ type: 'varchar', select: false })
    password: string;

    @Column({ type: 'bool', default: true })
    isActive: boolean;

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

    @OneToMany(() => UserToken, (user) => user.user)
    userTokens?: UserToken[];

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
        this.isActive = true;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
