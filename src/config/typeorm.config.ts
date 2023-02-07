import {
    TypeOrmModuleAsyncOptions,
    TypeOrmModuleOptions,
} from '@nestjs/typeorm'
import { environment } from 'src/environment'

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
    useFactory: (): TypeOrmModuleOptions => {
        const {
            name: database,
            host,
            port,
            username,
            password,
        } = environment.database

        return {
            type: 'postgres',
            entities: [
                `${__dirname}/../modules/**/entities/*.entity.{js,ts}`,
                `${__dirname}/../shared/entities/*.entity.{js,ts}`,
            ],
            database,
            host,
            port,
            username,
            password,
            synchronize: false,
            keepConnectionAlive: true,
            migrations: [`${__dirname}/../migrations/*{.ts,.js}`],
            migrationsRun: true,
        }
    },
}
