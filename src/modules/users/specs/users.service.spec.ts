import { Test, TestingModule } from '@nestjs/testing'
import { EntityManager } from 'typeorm'
import { createMock } from '@golevelup/ts-jest'
import { UsersService } from '../services/users.service'
import { userEntityMock } from './mocks/user-entity.mock'
import { usersResponseMock } from './mocks/users-response.mock'
import { ErrorsMessagesEnum } from '../../../shared/enums/error-messages.enum'
import { userMock } from './mocks/user.mock'

describe('UsersService', () => {
    let service: UsersService

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: EntityManager,
                    useValue: createMock<EntityManager>(),
                },
            ],
        }).compile()

        service = moduleRef.get<UsersService>(UsersService)
    })

    it('should be defined UsersService', () => {
        return expect(service).toBeDefined()
    })

    describe('getUsers', () => {
        const page = 1,
            limit = 1

        it('should return users', async () => {
            jest.spyOn(service['_usersRepository'], 'find').mockResolvedValue([
                userEntityMock,
            ])
            jest.spyOn(service['_usersRepository'], 'count').mockResolvedValue(
                1,
            )

            const users = await service.getUsers(page, limit)

            expect(service['_usersRepository'].find).toHaveBeenCalledTimes(1)
            expect(users).toEqual(usersResponseMock)
        })
    })

    describe('getUserByNickname', () => {
        const nickname = 'nickname'

        it('should return user', async () => {
            jest.spyOn(
                service['_usersRepository'],
                'findOne',
            ).mockResolvedValue(userEntityMock)

            const user = await service.getUserByNickname(nickname)

            expect(service['_usersRepository'].findOne).toHaveBeenCalledTimes(1)
            expect(user).toEqual(userMock)
        })

        it('throw USER_NOT_FOUND error', async () => {
            jest.spyOn(
                service['_usersRepository'],
                'findOne',
            ).mockResolvedValue(undefined)

            expect(service.getUserByNickname(nickname)).rejects.toThrow(
                ErrorsMessagesEnum.USER_NOT_FOUND,
            )
            expect(service['_usersRepository'].findOne).toHaveBeenCalledTimes(1)
        })
    })

    describe('getUserById', () => {
        const userId = '1'

        it('should return user entity', async () => {
            jest.spyOn(
                service['_usersRepository'],
                'findOne',
            ).mockResolvedValue(userEntityMock)

            const user = await service.getUserById(userId)

            expect(service['_usersRepository'].findOne).toHaveBeenCalledTimes(1)
            expect(user).toEqual(userEntityMock)
        })

        it('throw USER_NOT_FOUND error', async () => {
            jest.spyOn(
                service['_usersRepository'],
                'findOne',
            ).mockResolvedValue(undefined)

            expect(service.getUserById(userId)).rejects.toThrow(
                ErrorsMessagesEnum.USER_NOT_FOUND,
            )
            expect(service['_usersRepository'].findOne).toHaveBeenCalledTimes(1)
        })
    })

    describe('createUser', () => {
        const userBody = {
            name: 'name',
            email: 'email@g.com',
            password: 'pass',
        }

        it('throw USER_WITH_THIS_EMAIL_ALREADY_EXISTS error', async () => {
            jest.spyOn(
                service['_usersRepository'],
                'findOne',
            ).mockResolvedValue(userEntityMock)

            expect(service.createUser(userBody)).rejects.toThrow(
                ErrorsMessagesEnum.USER_WITH_THIS_EMAIL_ALREADY_EXISTS,
            )
            expect(service['_usersRepository'].findOne).toHaveBeenCalledTimes(1)
        })
    })

    describe('updateUser', () => {
        const userId = '1'
        const data = {
            nickname: 'nickname2',
            description: 'desc2',
        }

        it('should return updated data', async () => {
            jest.spyOn(service['_usersRepository'], 'findOne')
                .mockResolvedValueOnce(userEntityMock)
                .mockResolvedValueOnce(undefined)
            jest.spyOn(service['_usersRepository'], 'save').mockImplementation()

            const updatedData = await service.updateUser(userId, data)

            expect(service['_usersRepository'].findOne).toHaveBeenCalledTimes(2)
            expect(service['_usersRepository'].save).toHaveBeenCalledTimes(1)
            expect(updatedData).toEqual(data)
        })

        it('throw USER_NOT_FOUND error', async () => {
            jest.spyOn(
                service['_usersRepository'],
                'findOne',
            ).mockResolvedValue(undefined)

            expect(service.updateUser(userId, {})).rejects.toThrow(
                ErrorsMessagesEnum.USER_NOT_FOUND,
            )
            expect(service['_usersRepository'].findOne).toHaveBeenCalledTimes(1)
        })

        it('throw USER_WITH_THIS_NICKNAME_ALREADY_EXISTS error', async () => {
            jest.spyOn(
                service['_usersRepository'],
                'findOne',
            ).mockResolvedValue(userEntityMock)

            expect(service.updateUser(userId, {})).rejects.toThrow(
                ErrorsMessagesEnum.USER_WITH_THIS_NICKNAME_ALREADY_EXISTS,
            )
            expect(service['_usersRepository'].findOne).toHaveBeenCalledTimes(1)
        })
    })
})
