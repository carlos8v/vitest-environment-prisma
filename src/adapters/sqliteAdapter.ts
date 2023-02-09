import { resolve } from 'path'
import { promisify } from 'util'
import { exec } from 'child_process'
import { readFileSync, rm } from 'fs'

import { EnvironmentAdapterOptions, EnvironmentDatabaseCredentials, SqliteEnvironmentAdapterOptions } from '../@types'

const execSync = promisify(exec)
const rmSync = promisify(rm)

const prismaBinary = './node_modules/.bin/prisma'

export function getConnectionString(databaseCredentials: EnvironmentDatabaseCredentials) {
  const { dbName, dbSchema } = databaseCredentials
  return `file:./${dbName.replace('.db', '')}_${dbSchema}.db`
}

export async function setupDatabase(_adapterOptions: EnvironmentAdapterOptions) {
  await execSync(`${prismaBinary} 'db push --skip-generate --force-reset'`)
}

export async function teardownDatabase(adapterOptions: EnvironmentAdapterOptions) {
  const { databaseSchema, databaseName } = adapterOptions as SqliteEnvironmentAdapterOptions

  let prismaFolder = 'prisma'

  const packageJsonPath = process.env?.npm_package_json
  const packageJson = JSON.parse(readFileSync(packageJsonPath, { encoding: 'utf8' }))

  if (packageJson?.prisma?.schema) {
    const customPrismaFolder = packageJson.prisma.schema.split('/')
    customPrismaFolder.pop()
    prismaFolder = customPrismaFolder.join('/')
  }

  const databaseFile = resolve(process.cwd(), prismaFolder, `${databaseName.replace('.db', '')}_${databaseSchema}.db`)

  await rmSync(databaseFile)
  await rmSync(`${databaseFile}-journal`).catch(() => console.log('Journal file not created'))
}

export default {
  getConnectionString,
  setupDatabase,
  teardownDatabase
}
