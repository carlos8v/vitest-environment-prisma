import * as dotenv from 'dotenv'
import { Environment } from 'vitest'

import { PrismaEnvironmentOptions } from './@types'

import { prismaExecSync } from './lib'

export default <Environment>{
  name: 'prisma',
  async setup(global, options = {}) {
    const {
      envFile = '.env.test',
      prismaEnvVarName = 'DATABASE_URL',
    } = options as PrismaEnvironmentOptions

    const dangerousEnvFiles = ['.env', '.env.production']
    if (dangerousEnvFiles.includes(envFile)) {
      throw new Error(`For security reasons we do not allow the .env file to be: ${dangerousEnvFiles.join(', ')}.\n\nWe strongly advise you to use '.env.test'`)
    }

    if (envFile !== '') {
      dotenv.config({ path: envFile, override: true })

      if (!process.env[prismaEnvVarName] || process.env[prismaEnvVarName] === '') {
        throw new Error(`The ${prismaEnvVarName} environment variable used for the Prisma DB connection URL is not present or is empty!`)
      }

      global.process.env[prismaEnvVarName] = process.env[prismaEnvVarName]
    }

    await prismaExecSync('db push --skip-generate --force-reset')

    return {
      async teardown() {
        await prismaExecSync('migrate reset --skip-generate --force --skip-seed')
      }
    }
  }
}
