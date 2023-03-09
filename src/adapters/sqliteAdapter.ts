import { promisify } from 'util'
import { exec } from 'child_process'
import { rm } from 'fs'
import { tmpdir } from 'os';
import { EnvironmentAdapterOptions, EnvironmentDatabaseCredentials, SqliteEnvironmentAdapterOptions } from '../@types'

const execSync = promisify(exec)
const rmSync = promisify(rm)

const prismaBinary = './node_modules/.bin/prisma'

export function getConnectionString(databaseCredentials: EnvironmentDatabaseCredentials) {
  const { dbName, dbSchema } = databaseCredentials
  return `file:${tmpdir()}/${dbName.replace('.db', '')}_${dbSchema}.db`
}

export async function setupDatabase(_adapterOptions: EnvironmentAdapterOptions) {
  await execSync(`${prismaBinary} db push --skip-generate --force-reset`)
}

export async function teardownDatabase(adapterOptions: EnvironmentAdapterOptions) {
  const { databaseSchema, databaseName } = adapterOptions as SqliteEnvironmentAdapterOptions

  const databaseFile = `${tmpdir()}/${databaseName.replace('.db', '')}_${databaseSchema}.db`

  await rmSync(databaseFile)
  await rmSync(`${tmpdir()}/${databaseFile}-journal`).catch(() => console.log('Journal file not created'))
}

export default {
  getConnectionString,
  setupDatabase,
  teardownDatabase
}
