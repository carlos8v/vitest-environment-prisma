import { resolve } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

import { Client } from 'pg'

import { EnvironmentAdapterOptions, EnvironmentDatabaseCredentials, PsqlEnvironmentAdapterOptions } from '../@types'

const execSync = promisify(exec)

const prismaBinary = resolve('./node_modules/.bin/prisma')

export function getConnectionString(databaseCredentials: EnvironmentDatabaseCredentials) {
  const { dbUser, dbPass, dbHost, dbPort, dbName, dbSchema, multiSchema } = databaseCredentials
  if (multiSchema) return `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}_${dbSchema}`

  return `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?schema=${dbSchema}`
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

  const connectionDatabaseName = multiSchema ? `${databaseName}_${databaseSchema}` : databaseName
  const model = multiSchema ? 'DATABASE' : 'SCHEMA'
  const options = multiSchema ? 'WITH (FORCE)' : 'CASCADE'

  const client = new Client({ connectionString: strippedConnectionString })
  await client.connect()
  await client.query(`DROP ${model} IF EXISTS "${connectionDatabaseName}" ${options}`)
  await client.end()
}

export default {
  getConnectionString,
  setupDatabase,
  teardownDatabase
}
