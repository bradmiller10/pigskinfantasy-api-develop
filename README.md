## Description

## Helpful Links

- [TypeORM Postgres Column Types](https://typeorm.io/#/entities/column-types-for-postgres)
- [NestJS Graphql Quick Start](https://docs.nestjs.com/graphql/quick-start)
- [NestJS Graphql + TypeORM]

## Installation

```bash

```

## Running the app

```bash
$ docker compose up
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Migrations

1. docker compose run api npm run typeorm:migrate DescriptiveMigrationName

2. Ensure generated migration is exported in [db/migrations/index.ts](./src/db/migrations/index.ts)
