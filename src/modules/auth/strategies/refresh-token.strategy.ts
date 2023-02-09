import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { environment } from '../../../environment'
import { JwtPayload } from '../services/interfaces/jwt-payload.interface'
import { ErrorsMessagesEnum } from '../../../shared/enums/error-messages.enum'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: environment.tokenKeys.refreshKey,
            passReqToCallback: true,
        })
    }

    validate(req: Request, payload: Pick<JwtPayload, 'id'>): JwtPayload {
        const refreshToken = req
            .get('authorization')
            ?.replace('Bearer', '')
            .trim()

        if (!refreshToken)
            throw new ForbiddenException(
                ErrorsMessagesEnum.REFRESH_TOKEN_MALFORMED,
            )

        return {
            ...payload,
            refreshToken,
        }
    }
}
