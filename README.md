# `vitest-environment-prisma`

Vitest testing module for deploying your latest Prisma schema to a database before testing and resetting the database
after test execution has completed. See 
[⚡️ Vitest Environment ](https://vitest.dev/guide/environment.html#custom-environment) for more details.

🛈 **Important Note** 🛈 By default vitest will run tests in parallel which could impact you test run if you're defining
environments on a granular [per-file basis](https://vitest.dev/guide/environment.html#environments-for-specific-files). 
Use the `--no-threads` [vitest runner option](https://vitest.dev/guide/cli.html#options) to disable parallel test 
execution if you plan on using granular environments.

## Actions

### `Setup`
Environment runs `prisma db push --skip-generate --force-reset` in your application to bootstrap test database.

⚠️**WARNING**⚠️ Be aware that this can update your `production` database if you are not careful. Use this only on 
with non-production databases!

### `Teardown`
Environment runs `migrate reset --skip-generate --force --skip-seed` to drop all Prisma schema tables from the database.

---

## Setup Environment

Example:

`vite.config.ts`

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'prisma', // Required
    environmentOptions: {
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
| envFile          | Name of the `.env` file for test suite (set to empty string to disable) | `.env.test`    |
| prismaEnvVarName | The environment variable used for the Prisma DB connection URL          | `DATABASE_URL` |

## Configuring Prisma Database Connection

See the [Prisma database connections](https://www.prisma.io/docs/reference/database-reference/connection-urls#env) for
more information on how to properly set the connection URL from an environment variable.
