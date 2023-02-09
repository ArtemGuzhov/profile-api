import { Column, Entity, Index } from 'typeorm'
import { CommonBaseEntity } from '../../../shared/entities/common-base.entity'
import { ImgFile } from '../services/interfaces/img-file.interface'

@Entity('users')
export class UsersEntity extends CommonBaseEntity {
    @Column({ type: 'text' })
    @Index({ unique: true })
    email: string

    @Index({ unique: true })
    @Column({ type: 'text' })
    nickname: string

    @Column({ type: 'text' })
    name: string

    @Column({ type: 'text' })
    password: string

    @Column({ type: 'text', nullable: true })
    description: string | null

    @Column({ name: 'avatar', type: 'jsonb', nullable: true })
    avatar: ImgFile | null

    @Column({ name: 'header', type: 'jsonb', nullable: true })
    header: ImgFile | null

    @Column({ name: 'refresh_token', type: 'text', nullable: true })
    refreshToken: string | null
}
