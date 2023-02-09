import { BadRequestException, Injectable } from '@nestjs/common'
import { ErrorsMessagesEnum } from '../../../shared/enums/error-messages.enum'
import { compareHashes } from '../../../shared/helpers/compare-hashes.helper'
import { UsersService } from '../../users/services/users.service'
import { AuthResponse } from './interfaces/auth-response.interface'
import { Tokens } from './interfaces/tokens.interface'
import { JwtTokensService } from './jwt-tokens.service'

@Injectable()
export class AuthService {
    constructor(
        private readonly _usersService: UsersService,
        private readonly _jwtTokensService: JwtTokensService,
    ) {}

    /**
     *
     * @param email
     * @param password
     * @returns Tokens
     */
    async auth(userEmail: string, password: string): Promise<AuthResponse> {
        const user = await this._usersService.getUserByEmail(userEmail)

        const { id, name, nickname, email, avatar, header } = user

        const isMatch = await compareHashes(password, user.password)

        if (!isMatch) {
            throw new BadRequestException(ErrorsMessagesEnum.INCORRECT_DATA)
        }

        const tokens = await this._jwtTokensService.getTokens(user.id)
        await this._jwtTokensService.updateRefreshTokenHash(
            user.id,
            tokens.refreshToken,
        )

        return {
            user: { id, name, nickname, email, avatar, header },
            tokens,
        }
    }

    /**
     *
     * @param userId
     */
    async logout(userId: string): Promise<void> {
        await this._usersService.updateUser(userId, { refreshToken: null })
    }
}
