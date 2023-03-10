import { UsersEntity } from '../../entities/users.entity'

export const userEntityMock: UsersEntity = {
    id: '1',
    name: 'name',
    email: 'email@g.com',
    nickname: 'nickname',
    description: 'desc',
    password: 'WYgQjeal8EMoTDazqReciPRnKgvIQO+O77Gww3ruKPU=',
    refreshToken: '4erp43O6YqgM29RCL8ACVTRHrrOP242/URpS0+jF5Bc=',
    avatar: {
        id: '1',
        format: 'jpg',
    },
    header: {
        id: '2',
        format: 'jpg',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
}
