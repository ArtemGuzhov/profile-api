import { User } from './user.interface'

export interface UsersResponse {
    users: Omit<User, 'headerId'>[]
    amount: number
}
