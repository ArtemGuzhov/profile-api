import { Injectable, ForbiddenException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { environment } from '../../../environment'
import { ErrorsMessagesEnum } from '../../../shared/enums/error-messages.enum'
import { compareHashes } from '../../../shared/helpers/compare-hashes.helper'
import { getHash } from '../../../shared/helpers/get-hash.helper'
import { UsersService } from '../../users/services/users.service'
import { AuthResponse } from './interfaces/auth-response.interface'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { Tokens } from './interfaces/tokens.interface'

@Injectable()
export class JwtTokensService {
    constructor(
        private readonly _usersService: UsersService,
        private readonly _jwtService: JwtService,
    ) {}

    /**
     *
     * @param id
     * @param refreshToken
     * @returns Tokens
     */
    async refreshTokens(
        userId: string,
        refreshToken: string,
    ): Promise<AuthResponse> {
        const user = await this._usersService.getUserById(userId)

        if (!user.refreshToken) {
            throw new ForbiddenException(ErrorsMessagesEnum.FORBIDDEN)
        }

        const { id, name, nickname, email, avatar, header } = user

        const isMatch = await compareHashes(refreshToken, user.refreshToken)

        if (!isMatch) throw new ForbiddenException(ErrorsMessagesEnum.FORBIDDEN)

        const tokens = await this.getTokens(user.id)
        await this.updateRefreshTokenHash(userId, tokens.refreshToken)

        return {
            user: {id, name, nickname, email, avatar, header},
            tokens,
        }
    }

    /**
     *
     * @param id
     * @param refreshToken
     */
    async updateRefreshTokenHash(
        id: string,
        refreshToken: string,
    ): Promise<void> {
        const newRefreshToken = await getHash(refreshToken)

        await this._usersService.updateUser(id, {
            refreshToken: newRefreshToken,
        })
    }

    /**
     *
     * @param id
     * @returns Tokens
     */
    async getTokens(id: string): Promise<Tokens> {
        const jwtPayload: Pick<JwtPayload, 'id'> = {
            id,
        }

        const {
            tokenKeys: { accessKey, refreshKey },
        } = environment

        const [accessToken, refreshToken]: string[] = await Promise.all([
            this._jwtService.signAsync(jwtPayload, {
                secret: accessKey,
                expiresIn: '1d',
            }),
            this._jwtService.signAsync(jwtPayload, {
                secret: refreshKey,
                expiresIn: '3d',
            }),
        ])

        return {
            accessToken,
            refreshToken,
        }
    }
}
