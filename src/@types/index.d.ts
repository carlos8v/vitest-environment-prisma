export type PrismaEnvironmentOptions = {
  envFile: string
  multiSchema: boolean
  schemaPrefix: string
  adapter: 'mysql' | 'psql' | 'sqlite'
  prismaEnvVarName: string
  transformMode: 'ssr' | 'web'
}

export type EnvironmentDatabaseCredentials = {
  dbUser: string
  dbPass: string
  dbHost: string
  dbPort: string
  dbName: string
  dbSchema: string
  schemaPrefix?: string
  multiSchema: boolean
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
  schemaPrefix: string
}
