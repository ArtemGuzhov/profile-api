import { User } from '../../services/interfaces/user.interface'

export const userMock: User = {
    id: '1',
    name: 'name',
    email: 'email@g.com',
    nickname: 'nickname',
    avatar: {
        id: '1',
        format: 'jpg',
    },
    header: {
        id: '2',
        format: 'jpg',
    },
}
