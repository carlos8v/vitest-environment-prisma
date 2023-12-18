# `vitest-environment-prisma`

Vitest testing module for prisma migrate and teardown scripts. See [⚡️ Vitest Environment ](https://miniflare.dev/testing/vitest) for more
details.

## Actions

### `Setup`
Environment runs `prisma migrate deploy` in your application to bootstrap test database.

**:warning: Be aware that this can update your `production` database if you are not carefull. Use this only on `development` and always check your .env credentials**

### `Teardown`
Environment will drop your test database depending on your adapter

---

## Adapters

Databases supported by now:
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
      prismaEnvVarName: 'DATABASE_URL', // Optional
      transformMode: 'ssr', // Optional
    }
  }
})
```

---

## Environment Options

| Name             | Description                                                    | Default        |
|:-----------------|:---------------------------------------------------------------|:---------------|
| adapter          | Name database adapter. See [Adapters](#adapters)               | `mysql`        |
| envFile          | Name of the `.env` file for test suite                         | `.env.test`    |
| multiSchema      | Option to support multiple prisma schemas                      | `false`        |
| schemaPrefix     | Prefix to attach on the database name                          |                |
| prismaEnvVarName | The environment variable used for the Prisma DB connection URL | `DATABASE_URL` |
| transformMode    | This value determines how plugins will transform source code   | `ssr`          |

## Database Credentials

The following keys must be present on your `.env.test` file:

| Name            | Description                       | Example                  |
|:----------------|:----------------------------------|:-------------------------|
| `DATABASE_USER` | Database user credential          | `root`                   |
| `DATABASE_PASS` | Database user password credential | `root`                   |
| `DATABASE_HOST` | Database connection host          | `localhost`, `127.0.0.1` |
| `DATABASE_PORT` | Database connection port          | `5432`, `3306`           |
| `DATABASE_NAME` | Database name                     | `mydb`                   |

These credentials are necessary to construct the `DATABASE_URL` env value (can be overridden, see above) to which the 
prisma connection will be made. 
See the [Prisma database connections](https://www.prisma.io/docs/reference/database-reference/connection-urls#env) for 
more information on how to properly set the connection URL from an environment variable.

### Sqlite config

If you are using the sqlite adapter only the `DATABASE_NAME` env is required. The database file will be written to the
`/tmp` directory.

Make sure to use only the name: 

- `DATABASE_NAME=mydb` :heavy_check_mark:
- `DATABASE_NAME=mydb.db` :heavy_check_mark:
- `DATABASE_NAME=file:/mydb` :heavy_multiplication_x:
- `DATABASE_NAME=../mydb` :heavy_multiplication_x:
