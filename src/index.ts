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
      envFile = '.env.test',
      databaseName = 'prisma',
      databaseSchema = 'default',
      randomSchema = false,
      adapter = 'mysql'
    } = options as PrismaEnvironmentOptions

    if (!Object.keys(supportedAdapters).includes(adapter)) {
      throw new Error('Unsupported database adapter value.\n\nSee supported adapters in https://github.com/carlos8v/vitest-environment-prisma#adapters.')
    }

    dotenv.config({ path: envFile })
    const connectionString = process.env.DATABASE_URL

    if (!connectionString) {
      throw new Error('DATABASE_URL was not provided.\n\nSee more in https://github.com/carlos8v/vitest-environment-prisma#connection-string')
    }

    if (randomSchema && adapter === 'psql') {
      const newDatabaseUrl = process.env.DATABASE_URL
        .replace(/(schema=\w+&)|(schema=\w+$)/g, `schema=${randomUUID()}&`)
        .replace(/&$/i, '')

      process.env.DATABASE_URL = newDatabaseUrl
      global.process.env.DATABASE_URL = newDatabaseUrl
    }

    const adapterOptions = {
      connectionString,
      databaseName,
      databaseSchema
    }

    const { [adapter]: selectedAdapter } = supportedAdapters

    if (selectedAdapter?.setupDatabase)
      await selectedAdapter.setupDatabase(adapterOptions)

    return {
      async teardown() {
        if (selectedAdapter?.teardownDatabase)
          await selectedAdapter.teardownDatabase(adapterOptions)
      }
    }
  }
}
