import {
    Body,
    Controller,
    Get,
    Post,
    UseFilters,
    UseGuards,
} from '@nestjs/common'
import { GetRefreshToken } from '../../../shared/decorators/get-refresh-token.decorator'
import { GetUserId } from '../../../shared/decorators/get-user-id.decorator'
import { IsPublic } from '../../../shared/decorators/is-public.decorator'
import { RefreshTokenGuard } from '../../../shared/guards/refresh-token.guard'
import { AuthService } from '../services/auth.service'
import { AuthResponse } from '../services/interfaces/auth-response.interface'
import { Tokens } from '../services/interfaces/tokens.interface'
import { JwtTokensService } from '../services/jwt-tokens.service'
import { AuthDTO } from './dtos/auth.dto'

@Controller({
    version: '1',
    path: 'auth',
})
@UseFilters()
export class AuthControllerV1 {
    constructor(
        private readonly _authService: AuthService,
        private readonly _jwtTokensService: JwtTokensService,
    ) {}

    @IsPublic()
    @Post()
    async auth(@Body() body: AuthDTO): Promise<AuthResponse> {
        const { email, password } = body

        return await this._authService.auth(email, password)
    }

    @Get('logout')
    async logout(@GetUserId() userId: string): Promise<void> {
        return await this._authService.logout(userId)
    }

    @IsPublic()
    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    refreshTokens(
        @GetUserId() userId: string,
        @GetRefreshToken('refreshToken') refreshToken: string,
    ): Promise<AuthResponse> {
        return this._jwtTokensService.refreshTokens(userId, refreshToken)
    }
}
