import { Injectable, OnModuleInit } from '@nestjs/common'
import { Logardian } from 'logardian'
import { promises } from 'fs'
import { environment } from './environment'

@Injectable()
export class AppService implements OnModuleInit {
    private readonly _logger = new Logardian()

    onModuleInit() {
        this._createMediaDir()
    }

    private async _createMediaDir(): Promise<void> {
        try {
            await promises.mkdir(environment.paths.media)

            this._logger.log('Media directory created')
        } catch (error) {
            this._logger.log('Media directory already exist')
        }
    }
}
