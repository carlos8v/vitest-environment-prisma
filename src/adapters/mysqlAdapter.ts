import { exec } from 'child_process'
import { promisify } from 'util'
import { createConnection } from 'mysql2/promise'

import { EnvironmentAdapterOptions, MysqlEnvironmentAdapterOptions } from '../@types'

const execSync = promisify(exec)

const prismaBinary = './node_modules/.bin/prisma'

export async function setupDatabase(_adapterOptions: EnvironmentAdapterOptions) {
  await execSync(`${prismaBinary} migrate deploy`)
}

export async function teardownDatabase(adapterOptions: EnvironmentAdapterOptions) {
  const { connectionString, databaseName } = adapterOptions as MysqlEnvironmentAdapterOptions
  const client = await createConnection(connectionString)
  await client.connect()
  await client.query(`drop database ${databaseName}`)

  client.destroy()
}

export default {
  setupDatabase,
  teardownDatabase
}
