export type PrismaEnvironmentOptions = {
  envFile: string
  schemaPrefix: string
  adapter: 'mysql' | 'psql' | 'sqlite'
  prismaEnvVarName: string
}

export type EnvironmentDatabaseCredentials = {
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
  connectionString: string
  databaseName: string
  databaseSchema: string
}

export type MysqlEnvironmentAdapterOptions = {
  connectionString: string
  databaseName: string
  databaseSchema: string
}

export type SqliteEnvironmentAdapterOptions = {
  databaseName: string
  databaseSchema: string
}
