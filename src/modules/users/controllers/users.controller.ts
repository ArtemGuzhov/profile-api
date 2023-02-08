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
    ): Promise<any> {
        return await this._usersMediaService.saveFile(
            'b3ed8b99-3508-4ec7-a0c9-70ecd67db9d3',
            file,
            body.type,
        )
    }
}
