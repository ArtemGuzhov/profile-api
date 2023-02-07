import {
    Body,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileTypesEnum } from '../services/enums/file-types.enum'
import { UsersMediaService } from '../services/users-media.service'
import { UsersService } from '../services/users.service'

@Controller({
    version: '1',
    path: 'users',
})
export class UsersControllerV1 {
    constructor(
        private readonly _usersService: UsersService,
        private readonly _usersMediaService: UsersMediaService,
    ) {}

    @Post('media/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: { type: FileTypesEnum },
    ): Promise<void> {
        await this._usersMediaService.saveFile(
            'ee47883a-306e-4e5a-8d9a-ded90894e099',
            file,
            body.type,
        )
    }
}
