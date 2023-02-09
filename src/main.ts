import helmet from 'helmet'

import { ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory, repl } from '@nestjs/core'
import { Logardian } from 'logardian'
import { AppModule } from './app.module'
import { environment } from './environment'
import { corsConfig } from './config/cors.config'

const logger = new Logardian()

async function bootstrap() {
    const {
        app: { producation, host, port },
    } = environment

    logger.configure({})

    if (producation) {
        const app = await NestFactory.create(AppModule, { logger })

        app.use(helmet())

        app.enableVersioning({
            type: VersioningType.URI,
        })
        app.enableCors(corsConfig)
        app.useGlobalPipes(
            new ValidationPipe({ transform: true, whitelist: false }),
        )

        await app.listen(port, host, () =>
            logger.log(`Server running at http://${host}:${port}`),
        )
    } else {
        await repl(AppModule)
    }
}
bootstrap()
