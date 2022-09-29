# `vitest-environment-prisma`

Vitest testing module for prisma migrate and teardown scripts. See [⚡️ Vitest Environment ](https://miniflare.dev/testing/vitest) for more
details.

## Actions

### `Setup`
Environment runs `prisma migrate deploy` in your application to bootstrap test database.

**:warning: Be aware that this can update your `production` database if you are not carefull. Use this only on `development`.**

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
      envFile: '.env.test',
      databaseName: 'mydb'
    }
  }
})
```

---

## Environment Options

| Name | Description | Default |
|:-----|:------------|:--------|
| databaseName | Name of the database to drop on teardown | `prisma` |
| databaseSchema | Name of the schema to drop on teardown | `public` |
| randomSchema | Generate random UUID schema for test database | `false` |
| adapter | Name database adapter. See [Adapters](#adapters) | `mysql` |
| envFile | Name of the `.env` file for test suit | `.env.test` |

## Connection String

It is necessary to have the key `DATABASE_URL` in your `.env` file. See [Prisma database connections](https://www.prisma.io/docs/concepts/database-connectors) for more.

Examples:

| Adapter | Format |
|:--------|:-------|
| `mysql` | mysql://adalovelace:password@localhost:3306/mydb?connection_limit=5 |
| `psql` | postgresql://adalovelace:password@localhost:5432/mydb |
