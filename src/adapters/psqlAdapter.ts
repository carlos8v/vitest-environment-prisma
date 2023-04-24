import { resolve } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

import { Client } from 'pg'

import { EnvironmentAdapterOptions, EnvironmentDatabaseCredentials, PsqlEnvironmentAdapterOptions } from '../@types'

const execSync = promisify(exec)

const prismaBinary = resolve('./node_modules/.bin/prisma')

export function getConnectionString(databaseCredentials: EnvironmentDatabaseCredentials) {
  const {
    dbUser,
    dbPass,
    dbHost,
    dbPort,
    dbName,
    dbSchema,
    schemaPrefix,
    multiSchema
  } = databaseCredentials

  if (multiSchema) {
    return `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}_${schemaPrefix}${dbSchema}`
  }

  return `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?schema=${schemaPrefix}${dbSchema}`
}

export async function setupDatabase(_adapterOptions: EnvironmentAdapterOptions) {
  await execSync(`${prismaBinary} migrate deploy`)
}

export async function teardownDatabase(adapterOptions: EnvironmentAdapterOptions) {
  const {
    multiSchema,
    connectionString,
    databaseName,
    databaseSchema,
    schemaPrefix
  } = adapterOptions as PsqlEnvironmentAdapterOptions

  const strippedConnectionString = connectionString
    .replace(schemaPrefix, '')
    .replace(`_${databaseSchema}`, '')

  const dropDatabaseName = multiSchema
    ? `${databaseName}_${schemaPrefix}${databaseSchema}`
    : `${schemaPrefix}${databaseSchema}`

  const model = multiSchema ? 'DATABASE' : 'SCHEMA'
  const options = multiSchema ? '' : 'CASCADE'

  const client = new Client({ connectionString: strippedConnectionString })
  await client.connect()

  // Drop test database connections
  if (multiSchema) {
    await client.query(`SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE datname = '${databaseName}_${schemaPrefix}${databaseSchema}'
      AND pid <> pg_backend_pid();
    `)
  }

  await client.query(`DROP ${model} IF EXISTS "${dropDatabaseName}" ${options}`)
  await client.end()
}

export default {
  getConnectionString,
  setupDatabase,
  teardownDatabase
}
