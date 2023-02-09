import { Module } from '@nestjs/common'
import { UsersControllerV1 } from './controllers/users.controller.v1'
import { UsersMediaService } from './services/users-media.service'
import { UsersService } from './services/users.service'

@Module({
    providers: [UsersService, UsersMediaService],
    controllers: [UsersControllerV1],
    exports: [UsersService, UsersMediaService],
})
export class UsersModule {}
