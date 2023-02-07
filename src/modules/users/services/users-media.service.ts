import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'
import { v4 } from 'uuid'
import { UsersEntity } from '../entities/users.entity'
import { FileTypesEnum } from './enums/file-types.enum'
import { UsersService } from './users.service'
import { promises } from 'fs'
import { environment } from 'src/environment'
import { ErrorsMessagesEnum } from 'src/shared/enums/error-messages.enum'
import { Logardian } from 'logardian'

@Injectable()
export class UsersMediaService {
    private readonly _logger = new Logardian()
    private readonly _usersRepository: Repository<UsersEntity>

    constructor(
        @InjectEntityManager()
        private readonly _entityManager: EntityManager,
        private readonly _usersService: UsersService,
    ) {
        this._usersRepository = this._entityManager.getRepository(UsersEntity)
    }

    async saveFile(
        userId: string,
        file: Express.Multer.File,
        type: FileTypesEnum,
    ): Promise<any> {
        const pathToSave = `${environment.paths.media}/${userId}`

        const user = await this._usersService.getUserById(userId)

        if (type === FileTypesEnum.AVATAR) {
            if (user.avatarId !== null) {
                console.log('del')
            }
        }
    }

    private async _save(
        file: Express.Multer.File,
        path: string,
    ): Promise<void> {
        try {
            const fileId = v4()
            const format = file.mimetype.split('/').pop()

            const fileName = `${fileId}.${format}`

            promises.writeFile(`${path}/${fileName}`, file.buffer, 'binary')
        } catch (error) {
            this._logger.error(error)

            throw new InternalServerErrorException(
                ErrorsMessagesEnum.USER_MEDIA_SERVICE_NOT_AVAILABLE,
            )
        }
    }

    private async _delete(userId: string, fileId: string): Promise<void> {
        try {
        } catch (error) {}
    }

    async deleteFile(userId: string, fileId: string): Promise<any> {}
}
