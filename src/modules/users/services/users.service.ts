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
import { ErrorsMessagesEnum } from '../../../shared/enums/error-messages.enum'
import { FindOptions } from './interfaces/find-options.interface'
import { FindOptionsEnum } from './enums/find-options.enum'
import { promises } from 'fs'
import { environment } from '../../../environment'
import { getHash } from '../../../shared/helpers/get-hash.helper'

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
     */
    async getUsers(page: number, limit: number): Promise<UsersResponse> {
        const skipCount = page * limit

        const users = await this._usersRepository.find({
            order: { id: 'ASC' },
            skip: skipCount === 1 ? 0 : skipCount,
        })

        const usersCount =
            (await this._usersRepository.count()) -
            (skipCount === 1 ? 0 : skipCount)
        const amount = usersCount < 0 ? 0 : usersCount

        const filteredUsers = users.map(
            ({ id, name, nickname, email, avatar }) => ({
                id,
                name,
                nickname,
                email,
                avatar,
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
     */
    async getUserByNickname(userNickname: string): Promise<User> {
        const user = await this._find({ nickname: userNickname })

        if (!user) {
            throw new NotFoundException(ErrorsMessagesEnum.USER_NOT_FOUND)
        }

        const { id, name, nickname, email, avatar, header } = user

        return {
            id,
            name,
            nickname,
            email,
            avatar,
            header,
        }
    }

    /**
     *
     * @param userNickname
     * @returns User
     */
    async getUserByEmail(userEmail: string): Promise<UsersEntity> {
        const user = await this._find({ email: userEmail })

        if (!user) {
            throw new NotFoundException(ErrorsMessagesEnum.USER_NOT_FOUND)
        }

        return user
    }

    /**
     *
     * @param userId
     * @returns UsersEntity
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
     */
    async createUser(data: CreateUser): Promise<void> {
        const user = await this._find({ email: data.email })

        if (user) {
            throw new BadRequestException(
                ErrorsMessagesEnum.USER_WITH_THIS_EMAIL_ALREADY_EXISTS,
            )
        }

        const newNickname = v4()
        const passHash = await getHash(data.password)

        const newUser = this._usersRepository.create({
            ...data,
            nickname: newNickname,
            password: passHash,
        })
        await this._usersRepository.save(newUser)
        await promises.mkdir(`${environment.paths.media}/${newUser.id}`)
    }

    /**
     *
     * @param userId
     * @param data
     * @returns UpdateUser
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
