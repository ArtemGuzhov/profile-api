import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { UsersService } from '../../users/services/users.service'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { environment } from '../../../environment'
import { JwtPayload } from '../services/interfaces/jwt-payload.interface'

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly _usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: environment.tokenKeys.accessKey,
        })
    }

    async validate(payload: Pick<JwtPayload, 'id'>) {
        const refreshToken = await this._usersService
            .getUserById(payload.id)
            .then((user) => user.refreshToken)
            .catch(() => null)

        if (refreshToken === null) throw new UnauthorizedException()

        return payload
    }
}
