import { resolve } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

import { rm } from 'fs'
import { tmpdir } from 'os';

import { EnvironmentAdapterOptions, EnvironmentDatabaseCredentials, SqliteEnvironmentAdapterOptions } from '../@types'

const execSync = promisify(exec)
const rmSync = promisify(rm)

const prismaBinary = resolve('./node_modules/.bin/prisma')

export function getConnectionString(databaseCredentials: EnvironmentDatabaseCredentials) {
  const { dbName, dbSchema, schemaPrefix } = databaseCredentials
  return `file:${tmpdir()}/${dbName.replace('.db', '')}_${schemaPrefix}${dbSchema}.db`
}

export async function setupDatabase(_adapterOptions: EnvironmentAdapterOptions) {
  await execSync(`${prismaBinary} db push --skip-generate --force-reset`)
}

export async function teardownDatabase(adapterOptions: EnvironmentAdapterOptions) {
  const { databaseSchema, databaseName, schemaPrefix } = adapterOptions as SqliteEnvironmentAdapterOptions

  const databaseFile = `${tmpdir()}/${databaseName.replace('.db', '')}_${schemaPrefix}${databaseSchema}.db`

  await rmSync(databaseFile)
  await rmSync(`${databaseFile}-journal`).catch(() => {})
}

export default {
  getConnectionString,
  setupDatabase,
  teardownDatabase
}
