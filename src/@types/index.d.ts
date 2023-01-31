export type PrismaEnvironmentOptions = {
  adapter: 'mysql' | 'psql' | 'sqlite'
  envFile: string
  prismaEnvVarName: string
  schemaPrefix: string
  sqlitePath: string
}
