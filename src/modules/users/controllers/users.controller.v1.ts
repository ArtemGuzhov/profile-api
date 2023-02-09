import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ImgFile } from '../services/interfaces/img-file.interface'
import { UpdateUser } from '../services/interfaces/update-user.interface'
import { User } from '../services/interfaces/user.interface'
import { UsersResponse } from '../services/interfaces/users-response.interface'
import { UsersMediaService } from '../services/users-media.service'
import { UsersService } from '../services/users.service'
import { GetUsersDTO } from './dtos/get-users.dto'
import { RegisterUserDTO } from './dtos/register-user.dto'
import { UpdateUserDTO } from './dtos/update-user.dto'
import { UploadDTO } from './dtos/upload.dto'

@Controller({
    version: '1',
    path: 'users',
})
export class UsersControllerV1 {
    constructor(
        private readonly _usersService: UsersService,
        private readonly _usersMediaService: UsersMediaService,
    ) {}

    @Get()
    async getUsers(@Query() query: GetUsersDTO): Promise<UsersResponse> {
        const { page, limit } = query

        return await this._usersService.getUsers(page, limit)
    }

    @Get(':nickname')
    async getUser(@Param() param: { nickname: string }): Promise<User> {
        const nickname = param.nickname

        return await this._usersService.getUserByNickname(nickname)
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async registerUser(@Body() body: RegisterUserDTO) {
        return await this._usersService.createUser(body)
    }

    @Post('update')
    async updateUser(@Body() body: UpdateUserDTO): Promise<UpdateUser> {
        return await this._usersService.updateUser('userId', body)
    }

    @Post('media/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: UploadDTO,
    ): Promise<ImgFile> {
        return await this._usersMediaService.saveFile('userId', file, body.type)
    }
}
