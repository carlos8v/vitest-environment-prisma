import { exec } from 'child_process'
import { promisify } from 'util'

const execSync = promisify(exec)
const prismaBinary = './node_modules/.bin/prisma'

export async function prismaExecSync(prismaArgs: string) {
  return await execSync(`${prismaBinary} ${prismaArgs}`)
}
