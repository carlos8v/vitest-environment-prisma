import { randomUUID } from 'crypto'

import * as dotenv from 'dotenv'
import { Environment } from 'vitest'

import { PrismaEnvironmentOptions } from './@types'

import mysqlAdapter from './adapters/mysqlAdapter'
import psqlAdapter from './adapters/psqlAdapter'

const supportedAdapters = {
  mysql: mysqlAdapter,
  psql: psqlAdapter,
}

export default <Environment>{
  name: 'prisma',
  async setup(global, options = {}) {
    const {
      adapter = 'mysql',
      envFile = '.env.test',
      schemaPrefix = ''
    } = options as PrismaEnvironmentOptions

    if (!Object.keys(supportedAdapters).includes(adapter)) {
      throw new Error('Unsupported database adapter value.\n\nSee supported adapters in https://github.com/carlos8v/vitest-environment-prisma#adapters.')
    }

    const dangerousEnvFiles = ['.env', '.env.production']
    if (dangerousEnvFiles.includes(envFile)) {
      throw new Error(`For security reasons we do not allow the .env file to be: ${dangerousEnvFiles.join(', ')}.\n\nWe strongly advise you to use '.env.test'`)
    }

    dotenv.config({ path: envFile })

    const dbUser = process.env.DATABASE_USER
    const dbPass = process.env.DATABASE_PASS
    const dbHost = process.env.DATABASE_HOST
    const dbPort = process.env.DATABASE_PORT
    const dbName = process.env.DATABASE_NAME
    let dbSchema = randomUUID()

    if (adapter === 'mysql') {
      dbSchema = dbSchema.replace(/-/g, '_')
    }

    if ([dbUser, dbPass, dbHost, dbPort, dbName].some((env) => !env || env === '')) {
      const missingCredentials = [
        '`DATABASE_USER`',
        '`DATABASE_PASS`',
        '`DATABASE_HOST`',
        '`DATABASE_PORT`',
        '`DATABASE_NAME`'
      ].filter((env) => !process.env[env] || process.env[env] === '')

      throw new Error(`${missingCredentials.join(', ')} credentials are missing.\n\nSee more in https://github.com/carlos8v/vitest-environment-prisma#connection-string`)
    }

    const { [adapter]: selectedAdapter } = supportedAdapters
    const connectionString = selectedAdapter.getConnectionString({
      dbUser,
      dbPass,
      dbHost,
      dbPort,
      dbName: `${schemaPrefix}${dbName}`,
      dbSchema
    })

    process.env.DATABASE_URL = connectionString
    global.process.env.DATABASE_URL = connectionString

    const adapterOptions = {
      connectionString,
      databaseName: dbName,
      databaseSchema: dbSchema
    }

    await selectedAdapter.setupDatabase(adapterOptions)

    return {
      async teardown() {
        await selectedAdapter.teardownDatabase(adapterOptions)
      }
    }
  }
}
