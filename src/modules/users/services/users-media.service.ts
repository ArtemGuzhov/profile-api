import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import { v4 } from 'uuid'
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

    constructor(private readonly _usersService: UsersService) {
        this._mediaPath = environment.paths.media
    }

    /**
     *
     * @param userId
     * @param file
     * @param type
     * @returns ImgFile
     */
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
                    const { id: fileId, format } = user.header
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

    /**
     *
     * @param userId
     * @param type
     * @param file
     * @returns ImgFile
     */
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
                    await this._usersService.updateUser(userId, {
                        avatar: fileData,
                    })

                    return fileData
                case FileTypesEnum.HEADER:
                    await this._usersService.updateUser(userId, {
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

    /**
     *
     * @param userId
     * @param type
     * @param fileId
     * @param format
     */
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
                    await this._usersService.updateUser(userId, {
                        avatar: null,
                    })
                    break
                case FileTypesEnum.HEADER:
                    await this._usersService.updateUser(userId, {
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
