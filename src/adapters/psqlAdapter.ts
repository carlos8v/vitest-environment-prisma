import { exec } from 'child_process'
import { promisify } from 'util'

import { Client } from 'pg'

import { EnvironmentAdapterOptions, PsqlEnvironmentAdapterOptions } from '../@types'

const execSync = promisify(exec)

const prismaBinary = './node_modules/.bin/prisma'

export async function setupDatabase(_adapterOptions: EnvironmentAdapterOptions) {
  await execSync(`${prismaBinary} migrate deploy`)
}

export async function teardownDatabase(adapterOptions: EnvironmentAdapterOptions) {
  const { connectionString, databaseName, databaseSchema } = adapterOptions as PsqlEnvironmentAdapterOptions

  const dropDbString = databaseName !== 'public'
    ? `DROP SCHEMA IF EXISTS "${databaseSchema}" CASCADE`
    : `DROP DATABASE ${databaseName}`

  const client = new Client({ connectionString })
  await client.query(dropDbString)
  await client.end()
}

export default {
  setupDatabase,
  teardownDatabase
}
