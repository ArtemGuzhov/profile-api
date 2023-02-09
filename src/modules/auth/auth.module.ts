import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from '../users/users.module'
import { AuthControllerV1 } from './controllers/auth.controller.v1'
import { AuthService } from './services/auth.service'
import { JwtTokensService } from './services/jwt-tokens.service'
import { AccessTokenStrategy } from './strategies/access-token.strategy'
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy'

@Module({
    imports: [JwtModule.register({}), UsersModule],
    controllers: [AuthControllerV1],
    providers: [
        AuthService,
        JwtTokensService,
        AccessTokenStrategy,
        RefreshTokenStrategy,
    ],
})
export class AuthModule {}
