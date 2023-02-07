import { Column, Entity, Index } from 'typeorm'
import { CommonBaseEntity } from '../../../shared/entities/common-base.entity'

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

    @Column({ name: 'avatar_id', type: 'text', nullable: true, unique: true })
    avatarId: string | null

    @Column({ name: 'header_id', type: 'text', nullable: true, unique: true })
    headerId: string | null

    @Column({ name: 'refresh_token', type: 'text', nullable: true })
    refreshToken: string | null
}
