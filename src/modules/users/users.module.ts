import { Module } from '@nestjs/common'
import { UsersMediaService } from './services/users-media.service'
import { UsersService } from './services/users.service'

@Module({
    providers: [UsersService, UsersMediaService],
    exports: [UsersService, UsersMediaService],
})
export class UsersModule {}
