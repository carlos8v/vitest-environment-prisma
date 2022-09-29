import { exec } from 'child_process'
import { promisify } from 'util'

import { Client } from 'pg'

import { EnvironmentAdapterOptions, EnvironmentDatabaseCredentials, PsqlEnvironmentAdapterOptions } from '../@types'

const execSync = promisify(exec)

const prismaBinary = './node_modules/.bin/prisma'

export function getConnectionString(databaseCredentials: EnvironmentDatabaseCredentials) {
  const { dbUser, dbPass, dbHost, dbPort, dbName, dbSchema } = databaseCredentials
  return `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?schema=${dbSchema}`
}

export async function setupDatabase(_adapterOptions: EnvironmentAdapterOptions) {
  await execSync(`${prismaBinary} migrate deploy`)
}

export async function teardownDatabase(adapterOptions: EnvironmentAdapterOptions) {
  const { connectionString, databaseSchema } = adapterOptions as PsqlEnvironmentAdapterOptions

  const client = new Client({ connectionString })
  await client.connect()
  await client.query(`DROP SCHEMA IF EXISTS "${databaseSchema}" CASCADE`)
  await client.end()
}

export default {
  getConnectionString,
  setupDatabase,
  teardownDatabase
}
