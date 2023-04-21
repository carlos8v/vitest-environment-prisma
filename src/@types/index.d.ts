export type PrismaEnvironmentOptions = {
  envFile: string
  multiSchema: boolean
  schemaPrefix: string
  adapter: 'mysql' | 'psql' | 'sqlite'
  prismaEnvVarName: string
}

export type EnvironmentDatabaseCredentials = {
  multiSchema: boolean
  dbUser: string
  dbPass: string
  dbHost: string
  dbPort: string
  dbName: string
  dbSchema: string
}

export type EnvironmentAdapterOptions = {
  [key: string]: any
}

export type PsqlEnvironmentAdapterOptions = {
  multiSchema: boolean
  connectionString: string
  databaseName: string
  databaseSchema: string
  schemaPrefix: string
}

export type MysqlEnvironmentAdapterOptions = {
  connectionString: string
  databaseName: string
  databaseSchema: string
  schemaPrefix: string
}

export type SqliteEnvironmentAdapterOptions = {
  databaseName: string
  databaseSchema: string
}
