import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppService } from './app.service'
import { typeOrmConfig } from './config/typeorm.config'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { AccessTokenGuard } from './shared/guards/access-token.guard'

@Module({
    imports: [
        TypeOrmModule.forRootAsync(typeOrmConfig),
        UsersModule,
        AuthModule,
    ],
    providers: [AppService, { provide: APP_GUARD, useClass: AccessTokenGuard }],
})
export class AppModule {}
