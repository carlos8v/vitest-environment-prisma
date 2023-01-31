import * as dotenv from 'dotenv'
import { randomUUID } from 'crypto'
import { Environment } from 'vitest'
import { prismaExecSync } from './lib'
import { PrismaEnvironmentOptions } from './@types'

const supportedAdapters = ['mysql', 'psql', 'sqlite']

export default <Environment>{
  name: 'prisma',
  async setup(global, options = {}) {
    const {
      adapter = 'mysql',
      envFile = '.env.test',
      prismaEnvVarName = 'DATABASE_URL',
      schemaPrefix = '',
      sqlitePath = '/tmp'
    } = options as PrismaEnvironmentOptions

    if (!supportedAdapters.includes(adapter)) {
      throw new Error('Unsupported database adapter value.\n\nSee supported adapters in https://github.com/carlos8v/vitest-environment-prisma#adapters.')
    }

    const dangerousEnvFiles = ['.env', '.env.production']
    if (dangerousEnvFiles.includes(envFile)) {
      throw new Error(`For security reasons we do not allow the .env file to be: ${dangerousEnvFiles.join(', ')}.\n\nWe strongly advise you to use '.env.test'`)
    }

    if (envFile !== '') {
      dotenv.config({ path: envFile, override: true })
    }

    const dbUser = process.env.DATABASE_USER
    const dbPass = process.env.DATABASE_PASS
    const dbHost = process.env.DATABASE_HOST
    const dbPort = process.env.DATABASE_PORT
    const dbName = process.env.DATABASE_NAME
    let dbSchema = randomUUID()

    if (adapter === 'mysql') {
      dbSchema = dbSchema.replace(/-/g, '_')
    }

    if (adapter !== 'sqlite' && [dbUser, dbPass, dbHost, dbPort, dbName].some((env) => !env || env === '')) {
      const missingCredentials = [
        '`DATABASE_USER`',
        '`DATABASE_PASS`',
        '`DATABASE_HOST`',
        '`DATABASE_PORT`',
        '`DATABASE_NAME`'
      ].filter((env) => !process.env[env] || process.env[env] === '')

      throw new Error(`${missingCredentials.join(', ')} credentials are missing.\n\nSee more in https://github.com/carlos8v/vitest-environment-prisma#connection-string`)
    }

    let connectionString

    if (adapter === 'mysql') {
      connectionString = `mysql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${schemaPrefix}${dbName}_${dbSchema}`
    } else if (adapter === 'psql') {
      connectionString = `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${schemaPrefix}${dbName}?schema=${dbSchema}`
    } else if (adapter === 'sqlite') {
      connectionString = `file:${sqlitePath}/${schemaPrefix}${dbSchema}.sqlite`
    }

    process.env[prismaEnvVarName] = connectionString
    global.process.env[prismaEnvVarName] = connectionString

    await prismaExecSync('db push --skip-generate --force-reset')

    return {
      async teardown() {
        await prismaExecSync('migrate reset --skip-generate --force --skip-seed')
      }
    }
  }
}
