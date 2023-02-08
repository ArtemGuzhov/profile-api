import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'
import { v4 } from 'uuid'
import { UsersEntity } from '../entities/users.entity'
import { FileTypesEnum } from './enums/file-types.enum'
import { UsersService } from './users.service'
import { promises } from 'fs'
import { environment } from '../../../environment'
import { ErrorsMessagesEnum } from '../../../shared/enums/error-messages.enum'
import { Logardian } from 'logardian'
import { ImgFile } from './interfaces/img-file.interface'

@Injectable()
export class UsersMediaService {
    private readonly _logger = new Logardian()
    private readonly _mediaPath: string
    private readonly _usersRepository: Repository<UsersEntity>

    constructor(
        @InjectEntityManager()
        private readonly _entityManager: EntityManager,
        private readonly _usersService: UsersService,
    ) {
        this._usersRepository = this._entityManager.getRepository(UsersEntity)
        this._mediaPath = environment.paths.media
    }

    async saveFile(
        userId: string,
        file: Express.Multer.File,
        type: FileTypesEnum,
    ): Promise<ImgFile> {
        const user = await this._usersService.getUserById(userId)

        switch (type) {
            case FileTypesEnum.AVATAR:
                if (user.avatar !== null) {
                    const { id: fileId, format } = user.avatar
                    await this._delete(userId, type, fileId, format)
                }

                const avatar = await this._save(userId, type, file)

                return avatar
            case FileTypesEnum.HEADER:
                if (user.header !== null) {
                    const { id: fileId, format } = user.avatar
                    await this._delete(userId, type, fileId, format)
                }

                const header = await this._save(userId, type, file)

                return header
            default:
                throw new NotFoundException(
                    ErrorsMessagesEnum.FILE_TYPE_NOT_FOUND,
                )
        }
    }

    private async _save(
        userId: string,
        type: FileTypesEnum,
        file: Express.Multer.File,
    ): Promise<ImgFile> {
        try {
            const fileId = v4()
            const format = file.mimetype.split('/').pop().toLowerCase()

            const fileName = `${fileId}.${format}`
            const fileData = { id: fileId, format }

            promises.writeFile(
                `${this._mediaPath}/${userId}/${fileName}`,
                file.buffer,
                'binary',
            )

            switch (type) {
                case FileTypesEnum.AVATAR:
                    await this._usersRepository.save({
                        id: userId,
                        avatar: fileData,
                    })
                    return fileData
                case FileTypesEnum.HEADER:
                    await this._usersRepository.save({
                        id: userId,
                        header: fileData,
                    })
                    return fileData
                default:
                    throw new NotFoundException(
                        ErrorsMessagesEnum.FILE_TYPE_NOT_FOUND,
                    )
            }
        } catch (error) {
            this._logger.error(error)

            throw new InternalServerErrorException(
                ErrorsMessagesEnum.USER_MEDIA_SERVICE_NOT_AVAILABLE,
            )
        }
    }

    private async _delete(
        userId: string,
        type: FileTypesEnum,
        fileId: string,
        format: string,
    ): Promise<void> {
        try {
            const file = `${fileId}.${format}`

            await promises.unlink(`${this._mediaPath}/${userId}/${file}`)

            switch (type) {
                case FileTypesEnum.AVATAR:
                    await this._usersRepository.save({
                        id: userId,
                        avatar: null,
                    })
                    break
                case FileTypesEnum.HEADER:
                    await this._usersRepository.save({
                        id: userId,
                        header: null,
                    })
                    break
                default:
                    throw new NotFoundException(
                        ErrorsMessagesEnum.FILE_TYPE_NOT_FOUND,
                    )
            }
        } catch (error) {
            this._logger.error(error)

            throw new InternalServerErrorException(
                ErrorsMessagesEnum.USER_MEDIA_SERVICE_NOT_AVAILABLE,
            )
        }
    }
}
