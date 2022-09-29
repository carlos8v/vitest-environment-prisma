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
      envFile: '.env.test'
    }
  }
})
```

---

## Environment Options

| Name | Description | Default |
|:-----|:------------|:--------|
| adapter | Name database adapter. See [Adapters](#adapters) | `mysql` |
| envFile | Name of the `.env` file for test suit | `.env.test` |

## Database Credentials

The following keys must be present on your `.env.test` file:

| Name | Description | Example |
|:-----|:------------|:--------|
| `DATABASE_USER` | Database user credential | `root` |
| `DATABASE_PASS` | Database user password credential | `root` |
| `DATABASE_HOST` | Database connection host | `localhost`, `127.0.0.1` |
| `DATABASE_PORT` | Database connection port | `5432`, `3306` |
| `DATABASE_NAME` | Database name | `mydb` |

These credentials are necessary to make the `DATABASE_URL` env value to which the prisma connection will be made. See [Prisma database connections](https://www.prisma.io/docs/concepts/database-connectors) for more.
