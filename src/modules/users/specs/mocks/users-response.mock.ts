import { UsersResponse } from '../../services/interfaces/users-response.interface'

export const usersResponseMock: UsersResponse = {
    users: [
        {
            id: '1',
            name: 'name',
            email: 'email@g.com',
            nickname: 'nickname',
            avatar: {
                id: '1',
                format: 'jpg',
            },
        },
    ],
    amount: 1,
}
