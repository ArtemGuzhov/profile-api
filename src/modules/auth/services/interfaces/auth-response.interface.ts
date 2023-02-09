import { User } from '../../../users/services/interfaces/user.interface'
import { Tokens } from './tokens.interface'

export interface AuthResponse {
    user: User
    tokens: Tokens
}
