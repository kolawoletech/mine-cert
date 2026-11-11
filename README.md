# MineCert

MineCert is a multi-organisation platform for managing equipment lifecycle
records, technical documents, certificates, inspections, maintenance, and
compliance information in the mining and explosion-protection industry.

> **Development status:** The repository is being established incrementally.
> The pnpm workspace and initial PostgreSQL/Prisma foundation are in place.
> Applications, authentication, and domain workflows have not been implemented.

## Planned workspace

- `apps/web` — Next.js frontend.
- `apps/api` — NestJS REST API.
- `packages/database` — Prisma schema, migrations, and database client.
- `packages/shared` — Shared contracts and domain types.
- `packages/config` — Shared tooling configuration.
- `packages/ui` — Shared UI components when needed.
- `infrastructure/docker` — Supporting Docker assets.
- `docs` — Product, architecture, API, database, and decision documentation.
- `tests/e2e` — End-to-end tests.

The architecture is a modular monolith: the API owns business logic and
authorization, with PostgreSQL as the system of record. Organization scoping
and backend-enforced permissions are foundational requirements. Regulatory
rules will remain configurable until verified; administrative assessments
will not be represented as legal or regulatory certification.

## Prerequisites

- Node.js `>=22.12.0`
- pnpm `>=11.0.0`
- Docker with Docker Compose

The repository pins pnpm through the `packageManager` field in `package.json`.

## Getting started

Install workspace dependencies from the repository root:

```sh
pnpm install
```

There are no runnable applications yet. The `dev`, `build`, `lint`, `test`,
and `typecheck` workspace scripts will run the corresponding scripts in
packages as they are added.

### Start PostgreSQL

Copy `.env.example` to `.env`, then start the local database:

```sh
docker compose up -d
```

Apply the initial Prisma migration and generate the client:

```sh
pnpm --filter @minecert/database db:migrate
pnpm --filter @minecert/database db:generate
```

The Compose database is for local development only. Its data is stored in the
`postgres_data` named volume. To remove the container while preserving data,
run `docker compose down`; to also delete the local database data, run
`docker compose down --volumes`.

Never commit `.env` or other files containing credentials.

## Planned foundation milestones

1. Establish the pnpm workspace and shared tooling. **Complete.**
2. Add PostgreSQL with Docker Compose and a Prisma schema/migration for the
   initial foundation entities. **In progress.**
3. Add the NestJS API, configuration validation, health endpoint, and
   OpenAPI documentation.
4. Add the Next.js landing/dashboard shell.
5. Add setup, architecture, API, database, product, and decision
   documentation, then verify the complete workspace.

These are planned milestones, not claims that the functionality is already
available.
