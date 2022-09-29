export type PrismaEnvironmentOptions = {
  envFile: string
  randomSchema: boolean
  databaseName: string
  databaseSchema: string
  adapter: 'mysql' | 'psql'
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
}
