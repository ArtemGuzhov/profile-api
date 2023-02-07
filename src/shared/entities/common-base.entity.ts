import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm'

export class CommonBaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date
}
