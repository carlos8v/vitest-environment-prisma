import { randomUUID } from 'crypto'

import * as dotenv from 'dotenv'
import { Environment } from 'vitest'

import { PrismaEnvironmentOptions } from './@types'

import mysqlAdapter from './adapters/mysqlAdapter'
import psqlAdapter from './adapters/psqlAdapter'

const adapters = {
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

    if (!Object.keys(adapters).includes(adapter)) {
      console.error('Unsupported database adapter value')
      process.exit(1)
    }

    dotenv.config({ path: envFile })
    const connectionString = process.env.DATABASE_URL

    if (!connectionString) {
      console.error('DATABASE_URL was not provided')
      process.exit(1)
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

    const { setupDatabase, teardownDatabase } = adapters[adapter]
    await setupDatabase(adapterOptions)

    return {
      async teardown() {
        await teardownDatabase(adapterOptions)
      }
    }
  }
}
