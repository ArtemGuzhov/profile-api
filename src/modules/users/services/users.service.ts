import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'
import { UsersEntity } from '../entities/users.entity'
import { UpdateUser } from './interfaces/update-user.interface'
import { v4 } from 'uuid'
import { UsersResponse } from './interfaces/users-response.interface'
import { User } from './interfaces/user.interface'
import { CreateUser } from './interfaces/create-user.interface'
import { createHash } from 'crypto'
import { ErrorsMessagesEnum } from 'src/shared/enums/error-messages.enum'
import { FindOptions } from './interfaces/find-options.interface'
import { FindOptionsEnum } from './enums/find-options.enum'
import { promises } from 'fs'
import { environment } from 'src/environment'

@Injectable()
export class UsersService {
    private readonly _usersRepository: Repository<UsersEntity>

    constructor(
        @InjectEntityManager()
        private readonly _entityManager: EntityManager,
    ) {
        this._usersRepository = this._entityManager.getRepository(UsersEntity)
    }

    /**
     *
     * @param page
     * @param limit
     * @returns UsersResponse
     *
     * @devNotes repl: await get(UsersService).getUsers(1, 10)
     */
    async getUsers(page: number, limit: number): Promise<UsersResponse> {
        const skipCount = page * limit

        const users = await this._usersRepository.find({
            order: { id: 'ASC' },
            skip: skipCount,
        })

        const usersCount = (await this._usersRepository.count()) - skipCount
        const amount = usersCount < 0 ? 0 : usersCount

        const filteredUsers = users.map(
            ({ id, name, nickname, email, avatarId }) => ({
                id,
                name,
                nickname,
                email,
                avatarId,
            }),
        )

        return {
            users: filteredUsers,
            amount,
        }
    }

    /**
     *
     * @param userNickname
     * @returns User
     *
     * @devNotes repl: await get(UsersService).getUserByNickname('nickname')
     */
    async getUserByNickname(userNickname: string): Promise<User> {
        const user = await this._find({ nickname: userNickname })

        if (!user) {
            throw new NotFoundException(ErrorsMessagesEnum.USER_NOT_FOUND)
        }

        const { id, name, nickname, email, avatarId, headerId } = user

        return {
            id,
            name,
            nickname,
            email,
            avatarId,
            headerId,
        }
    }

    /**
     *
     * @param userId
     * @returns UsersEntity
     *
     * @devNotes repl: await get(UsersService).getUserById('id')
     */
    async getUserById(userId: string): Promise<UsersEntity> {
        const user = await this._find({ id: userId })

        if (!user) {
            throw new NotFoundException(ErrorsMessagesEnum.USER_NOT_FOUND)
        }

        return user
    }

    /**
     *
     * @param userId
     * @param data
     * @returns boolean
     *
     * @devNotes repl: await get(UsersService).createUser({name: 'email', email: 'email@g.com', password: 'password'})
     */
    async createUser(data: CreateUser): Promise<boolean> {
        const user = await this._find({ email: data.email })

        if (user) {
            throw new BadRequestException(
                ErrorsMessagesEnum.USER_WITH_THIS_EMAIL_ALREADY_EXISTS,
            )
        }

        const newNickname = v4()
        const passHash = createHash('sha256')
            .update(data.password)
            .digest('base64')

        const newUser = this._usersRepository.create({
            ...data,
            nickname: newNickname,
            password: passHash,
        })
        await this._usersRepository.save(newUser)
        await promises.mkdir(`${environment.paths.media}/${newUser.id}`)

        return true
    }

    /**
     *
     * @param userId
     * @param data
     * @returns UpdateUser
     *
     * @devNotes repl: await get(UsersService).updateUser({nickname: 'nickname', name: 'name', description: 'desc'})
     */
    async updateUser(userId: string, data: UpdateUser): Promise<UpdateUser> {
        const user = await this._find({ id: userId })

        if (!user) {
            throw new NotFoundException(ErrorsMessagesEnum.USER_NOT_FOUND)
        }

        const isExistNickname = !!(await this._find({
            nickname: data.nickname,
        }))

        if (isExistNickname) {
            throw new BadRequestException(
                ErrorsMessagesEnum.USER_WITH_THIS_NICKNAME_ALREADY_EXISTS,
            )
        }

        await this._usersRepository.save({ id: userId, ...data })

        return data
    }

    /**
     *
     * @param options
     * @returns UsersEntity | undefined
     */
    private async _find(
        options: FindOptions,
    ): Promise<UsersEntity | undefined> {
        const { id, email, nickname } = options

        const type = Object.keys(options)[0]

        switch (type) {
            case FindOptionsEnum.ID:
                return await this._usersRepository.findOne({ id })
            case FindOptionsEnum.EMAIL:
                return await this._usersRepository.findOne({ email })
            case FindOptionsEnum.NICKNAME:
                return await this._usersRepository.findOne({ nickname })
            default:
                return undefined
        }
    }
}
