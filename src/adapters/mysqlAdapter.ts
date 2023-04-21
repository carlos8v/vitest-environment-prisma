import { resolve } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

import { createConnection } from 'mysql2/promise'

import { EnvironmentAdapterOptions, EnvironmentDatabaseCredentials, MysqlEnvironmentAdapterOptions } from '../@types'

const execSync = promisify(exec)

const prismaBinary = resolve('./node_modules/.bin/prisma')

export function getConnectionString(databaseCredentials: EnvironmentDatabaseCredentials) {
  const { dbUser, dbPass, dbHost, dbPort, dbName, dbSchema } = databaseCredentials
  return `mysql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}_${dbSchema}`
}

export async function setupDatabase(_adapterOptions: EnvironmentAdapterOptions) {
  await execSync(`${prismaBinary} migrate deploy`)
}

export async function teardownDatabase(adapterOptions: EnvironmentAdapterOptions) {
  const {
    connectionString,
    databaseName,
    databaseSchema,
    schemaPrefix
  } = adapterOptions as MysqlEnvironmentAdapterOptions

  const strippedConnectionString = connectionString
    .replace(schemaPrefix, '')
    .replace(`_${databaseSchema}`, '')

  const client = await createConnection(strippedConnectionString)
  await client.connect()
  await client.query(`drop database ${databaseName}_${databaseSchema}`)
  client.destroy()
}

export default {
  getConnectionString,
  setupDatabase,
  teardownDatabase
}
