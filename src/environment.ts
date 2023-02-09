import * as env from 'env-var'
import * as dotenv from 'dotenv'

import { readFileSync } from 'fs'
import { join } from 'path'

const loadEnv = dotenv.parse(readFileSync(join(__dirname, '..', '.env')))

Object.assign(process.env, loadEnv)

export const environment = {
    app: {
        producation:
            env.get('NODE_ENV').default('development').asString() ===
            'production',
        host: env.get('HOST').required().default('localhost').asString(),
        port: env.get('PORT').required().default('3000').asPortNumber(),
    },
    database: {
        host: env.get('PSQL_HOST').required().default('localhost').asString(),
        port: env.get('PSQL_PORT').required().default('3000').asPortNumber(),
        name: env.get('PSQL_DATABASE').required().asString(),
        username: env.get('PSQL_USERNAME').required().asString(),
        password: env.get('PSQL_PASSWORD').required().asString(),
    },
    paths: {
        media: env.get('MEDIA_PATH').required().asString(),
    },
}
