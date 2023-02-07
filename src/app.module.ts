import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmConfig } from './config/typeorm.config'
import { UsersControllerV1 } from './modules/users/controllers/users.controller'
import { UsersModule } from './modules/users/users.module'

@Module({
    imports: [TypeOrmModule.forRootAsync(typeOrmConfig), UsersModule],
    controllers: [UsersControllerV1],
    providers: [],
})
export class AppModule {}
