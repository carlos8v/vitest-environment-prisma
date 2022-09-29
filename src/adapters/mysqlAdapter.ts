import { exec } from 'child_process'
import { promisify } from 'util'

import { createConnection } from 'mysql2/promise'

import { EnvironmentAdapterOptions, EnvironmentDatabaseCredentials, MysqlEnvironmentAdapterOptions } from '../@types'

const execSync = promisify(exec)

const prismaBinary = './node_modules/.bin/prisma'

export function getConnectionString(databaseCredentials: EnvironmentDatabaseCredentials) {
  const { dbUser, dbPass, dbHost, dbPort, dbName, dbSchema } = databaseCredentials
  return `mysql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}_${dbSchema}`
}

export async function setupDatabase(adapterOptions: EnvironmentAdapterOptions) {
  const { connectionString, databaseName, databaseSchema } = adapterOptions as MysqlEnvironmentAdapterOptions

  const strippedConnectionString = connectionString.replace(`_${databaseSchema}`, '')

  const client = await createConnection(strippedConnectionString)
  await client.connect()
  await client.query(`create database ${databaseName}_${databaseSchema}`)
  client.destroy()

  await execSync(`${prismaBinary} migrate deploy`)
}

export async function teardownDatabase(adapterOptions: EnvironmentAdapterOptions) {
  const { connectionString, databaseName, databaseSchema } = adapterOptions as MysqlEnvironmentAdapterOptions

  const client = await createConnection(connectionString)
  await client.connect()
  await client.query(`drop database ${databaseName}_${databaseSchema}`)
  client.destroy()
}

export default {
  getConnectionString,
  setupDatabase,
  teardownDatabase
}
