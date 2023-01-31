# `vitest-environment-prisma`

Vitest testing module for deploying your latest Prisma schema to a database before testing and resetting the database
after test execution has completed. See 
[⚡️ Vitest Environment ](https://vitest.dev/guide/environment.html#custom-environment) for more details.

## Actions

### `Setup`
Environment runs `prisma db push --skip-generate --force-reset` in your application to bootstrap test database.

⚠️**WARNING**⚠️ Be aware that this can update your `production` database if you are not careful. Use this only on 
with non-production databases!

### `Teardown`
Environment runs `migrate reset --skip-generate --force --skip-seed` to drop all Prisma schema tables from the database.

---

## Adapters

Supported databases:
- `mysql`
- `psql`
- `sqlite`

## Setup Environment

Example:

`vite.config.ts`

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'prisma', // Required
    environmentOptions: {
      adapter: 'mysql',
      envFile: '.env.test',
      prismaEnvVarName: 'DATABASE_URL'  // Overrides the environment variable used for the Prisma DB connection URL 
    }
  }
})
```

---

## Environment Options

| Name             | Description                                                             | Default        |
|:-----------------|:------------------------------------------------------------------------|:---------------|
| adapter          | Name database adapter. See [Adapters](#adapters)                        | `mysql`        |
| envFile          | Name of the `.env` file for test suite (set to empty string to disable) | `.env.test`    |
| prismaEnvVarName | The environment variable used for the Prisma DB connection URL          | `DATABASE_URL` |
| schemaPrefix     | Prefix to prepend to the database name                                  |                |
| sqlitePath       | The path to store database files within for the `sqlite` adapter        | `/tmp`         |

## Database Credentials

The following keys must be present on your `.env.test` file or set in your environment when using the `mysql` or `psql`
adapters:

| Name            | Description                       | Example                  |
|:----------------|:----------------------------------|:-------------------------|
| `DATABASE_USER` | Database user credential          | `root`                   |
| `DATABASE_PASS` | Database user password credential | `root`                   |
| `DATABASE_HOST` | Database connection host          | `localhost`, `127.0.0.1` |
| `DATABASE_PORT` | Database connection port          | `5432`, `3306`           |
| `DATABASE_NAME` | Database name                     | `mydb`                   |

These credentials are necessary to construct the `DATABASE_URL` env value to which the prisma connection will be made. 
See the [Prisma database connections](https://www.prisma.io/docs/reference/database-reference/connection-urls#env) for
more information on how to properly set the connection URL from an environment variable.
