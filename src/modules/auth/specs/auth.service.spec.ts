import { Test, TestingModule } from '@nestjs/testing'
import { createMock } from '@golevelup/ts-jest'
import { AuthService } from '../services/auth.service'
import { UsersService } from '../../users/services/users.service'
import { JwtTokensService } from '../services/jwt-tokens.service'
import { userEntityMock } from '../../users/specs/mocks/user-entity.mock'
import { tokensMock } from './mocks/tokens.mock'
import { ErrorsMessagesEnum } from '../../../shared/enums/error-messages.enum'
import { userMock } from '../../users/specs/mocks/user.mock'

describe('AuthService', () => {
    let service: AuthService

    const userPayloadMock = { email: 'email@g.com', password: 'Pa$$w0rd123' }

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: createMock<UsersService>() },
                {
                    provide: JwtTokensService,
                    useValue: createMock<JwtTokensService>(),
                },
            ],
        }).compile()

        service = moduleRef.get<AuthService>(AuthService)
    })

    it('should be defined AuthService', () => {
        return expect(service).toBeDefined()
    })

    describe('auth', () => {
        it('should log in and return tokens', async () => {
            const { email, password } = userPayloadMock

            jest.spyOn(
                service['_usersService'],
                'getUserByEmail',
            ).mockResolvedValue(userEntityMock)
            jest.spyOn(
                service['_jwtTokensService'],
                'getTokens',
            ).mockResolvedValue(tokensMock)
            jest.spyOn(
                service['_jwtTokensService'],
                'updateRefreshTokenHash',
            ).mockImplementation()

            const authRes = await service.auth(email, password)

            expect(
                service['_usersService'].getUserByEmail,
            ).toHaveBeenCalledTimes(1)
            expect(
                service['_jwtTokensService'].getTokens,
            ).toHaveBeenCalledTimes(1)
            expect(
                service['_jwtTokensService'].updateRefreshTokenHash,
            ).toHaveBeenCalledTimes(1)
            expect(authRes).toEqual({
                user: userMock,
                tokens: tokensMock,
            })
        })

        it('throw USER_NOT_FOUND error', async () => {
            const { email, password } = userPayloadMock

            jest.spyOn(
                service['_usersService'],
                'getUserByEmail',
            ).mockResolvedValue(userEntityMock)

            expect(service.auth(email, password + '!')).rejects.toThrow(
                ErrorsMessagesEnum.INCORRECT_DATA,
            )
            expect(
                service['_usersService'].getUserByEmail,
            ).toHaveBeenCalledTimes(1)
        })
    })

    describe('logout', () => {
        it('should nullify refresh token', async () => {
            const { id } = userEntityMock

            jest.spyOn(
                service['_usersService'],
                'updateUser',
            ).mockImplementation()

            await service.logout(id)

            expect(service['_usersService'].updateUser).toHaveBeenCalledTimes(1)
        })
    })
})
