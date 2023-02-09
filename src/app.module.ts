import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppService } from './app.service'
import { typeOrmConfig } from './config/typeorm.config'
import { UsersControllerV1 } from './modules/users/controllers/users.controller.v1'
import { UsersModule } from './modules/users/users.module'

@Module({
    imports: [TypeOrmModule.forRootAsync(typeOrmConfig), UsersModule],
    controllers: [UsersControllerV1],
    providers: [AppService],
})
export class AppModule {}
