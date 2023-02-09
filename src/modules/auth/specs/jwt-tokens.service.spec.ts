import { Test, TestingModule } from '@nestjs/testing'
import { createMock } from '@golevelup/ts-jest'
import { UsersService } from '../../users/services/users.service'
import { JwtTokensService } from '../services/jwt-tokens.service'
import { userEntityMock } from '../../users/specs/mocks/user-entity.mock'
import { tokensMock } from './mocks/tokens.mock'
import { JwtService } from '@nestjs/jwt'
import { ErrorsMessagesEnum } from '../../../shared/enums/error-messages.enum'

describe('JwtTokensService', () => {
    let service: JwtTokensService

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                JwtTokensService,
                { provide: UsersService, useValue: createMock<UsersService>() },
                { provide: JwtService, useValue: createMock<JwtService>() },
            ],
        }).compile()

        service = moduleRef.get<JwtTokensService>(JwtTokensService)
    })

    it('should be defined JwtTokensService', () => {
        return expect(service).toBeDefined()
    })

    describe('refreshTokens', () => {
        it('should log in and return tokens', async () => {
            const { id } = userEntityMock
            const refreshToken = 'refreshToken'

            jest.spyOn(
                service['_usersService'],
                'getUserById',
            ).mockResolvedValue(userEntityMock)
            jest.spyOn(service, 'getTokens').mockResolvedValue(tokensMock)
            jest.spyOn(service, 'updateRefreshTokenHash').mockImplementation()

            const tokens = await service.refreshTokens(id, refreshToken)

            expect(service['_usersService'].getUserById).toHaveBeenCalledTimes(
                1,
            )
            expect(service.getTokens).toHaveBeenCalledTimes(1)
            expect(service.updateRefreshTokenHash).toHaveBeenCalledTimes(1)
            expect(tokens).toEqual(tokensMock)
        })

        it('throw ACCESS_DENIED error if user refresh token to equal null', async () => {
            const { id } = userEntityMock
            const refreshToken = 'refreshToken'

            jest.spyOn(
                service['_usersService'],
                'getUserById',
            ).mockResolvedValue({ ...userEntityMock, refreshToken: null })

            expect(service.refreshTokens(id, refreshToken)).rejects.toThrow(
                ErrorsMessagesEnum.FORBIDDEN,
            )
            expect(service['_usersService'].getUserById).toHaveBeenCalledTimes(
                1,
            )
        })

        it('throw ACCESS_DENIED error if not math refresh tokens', async () => {
            const { id } = userEntityMock
            const refreshToken = 'refreshToken!'

            jest.spyOn(
                service['_usersService'],
                'getUserById',
            ).mockResolvedValue(userEntityMock)

            expect(service.refreshTokens(id, refreshToken)).rejects.toThrow(
                ErrorsMessagesEnum.FORBIDDEN,
            )
            expect(service['_usersService'].getUserById).toHaveBeenCalledTimes(
                1,
            )
        })
    })

    describe('updateRefreshTokenHash', () => {
        it('should update refresh token hash', async () => {
            const { id } = userEntityMock
            const refreshToken = 'refreshToken'

            jest.spyOn(
                service['_usersService'],
                'updateUser',
            ).mockImplementation()

            await service.updateRefreshTokenHash(id, refreshToken)
            expect(service['_usersService'].updateUser).toHaveBeenCalledTimes(1)
        })
    })

    describe('getTokens', () => {
        it('should return access and refresh tokens', async () => {
            const { id } = userEntityMock
            const { accessToken, refreshToken } = tokensMock

            jest.spyOn(service['_jwtService'], 'signAsync')
                .mockResolvedValueOnce(accessToken)
                .mockResolvedValueOnce(refreshToken)

            const tokens = await service.getTokens(id)

            expect(service['_jwtService'].signAsync).toHaveBeenCalledTimes(2)
            expect(tokens).toEqual(tokensMock)
        })
    })
})
