# MineCert

MineCert is a multi-organisation platform for managing equipment lifecycle
records, technical documents, certificates, inspections, maintenance, and
compliance information in the mining and explosion-protection industry.

> **Development status:** The repository is being established incrementally.
> The pnpm workspace and initial PostgreSQL/Prisma foundation are in place.
> The NestJS API foundation is in place. The web application, authentication,
> and domain workflows have not been implemented.

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
authorization, with PostgreSQL as the system of record. Organisation scoping
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

The API is runnable; the web application is not yet implemented. The `dev`,
`build`, `lint`, `test`, and `typecheck` workspace scripts will run the
corresponding scripts in packages as they are added.

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

### Run the API

After starting PostgreSQL and applying the database migration:

```sh
pnpm --filter @minecert/api dev
```

The API listens on `http://localhost:3001` by default. Liveness and readiness
checks are available at `/api/v1/health/live` and `/api/v1/health/ready`.
Interactive OpenAPI documentation is available at `/docs`.

The readiness endpoint returns `503 Service Unavailable` if PostgreSQL cannot
be reached. The liveness endpoint does not depend on the database.

## Planned foundation milestones

1. Establish the pnpm workspace and shared tooling. **Complete.**
2. Add PostgreSQL with Docker Compose and a Prisma schema/migration for the
   initial foundation entities. **Complete.**
3. Add the NestJS API, configuration validation, health endpoint, and
   OpenAPI documentation. **Complete.**
4. Add the Next.js landing/dashboard shell.
5. Add setup, architecture, API, database, product, and decision
   documentation, then verify the complete workspace.

These are planned milestones, not claims that the functionality is already
available.

## Database foundation

The initial Prisma migrations establish organisations, users and
memberships, global role/permission definitions, organisation-scoped
equipment, shared equipment-type and manufacturer catalogs, laboratory-issued
certificates with revisions, and organization-owned documents with version
records. Equipment-to-certificate and equipment-to-document links
are represented explicitly.

Reference catalogs and role/permission definitions are global in this
foundation; organisation-specific role definitions are not yet supported.
The schema provides tenant ownership and unique equipment identifiers within
an organisation. API services must still scope every operation to the
authenticated organisation and validate cross-organisation links; the schema
does not replace backend authorization. Certificate and document revisions
are history records; write paths must append revisions rather than mutate
published history.

The local database listens on port `5435` by default to avoid conflicts with
other local PostgreSQL installations. Override `POSTGRES_PORT` in `.env` if
needed.

## API foundation

The API validates `DATABASE_URL`, `NODE_ENV`, and `PORT` at startup, applies
global DTO validation, and publishes versioned REST routes under `/api/v1`.
Swagger UI and its OpenAPI document are served at `/docs` and `/docs-json`.
Only liveness and database-readiness routes are implemented; authentication,
authorization, and domain endpoints remain planned.
