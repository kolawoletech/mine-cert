# MineCert

MineCert is a multi-organisation platform for managing equipment lifecycle
records, technical documents, certificates, inspections, maintenance, and
compliance information in the mining and explosion-protection industry.

> **Development status:** The repository is being established incrementally.
> The pnpm workspace and initial PostgreSQL/Prisma foundation are in place.
> The NestJS API, Next.js dashboard preview, and configurable OIDC sign-in
> foundation are in place. Tenant authorization and domain workflows have
> not been implemented.

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

The API and web preview are runnable. Dashboard figures and equipment
records are illustrative only; they are not connected to the API. The root
`dev`, `build`, `lint`, `test`, and `typecheck` scripts run corresponding
workspace scripts where available.

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

### Run the web preview

In another terminal:

```sh
pnpm --filter @minecert/web dev
```

Open `http://localhost:3000`. The responsive dashboard uses illustrative
sample data. Search, notifications, tenant authorization, and business
operations are not yet implemented.

### Configure OIDC sign-in

The web app supports a standards-based OIDC provider. Set
`AUTH_OIDC_ISSUER`, `AUTH_OIDC_CLIENT_ID`, `AUTH_OIDC_CLIENT_SECRET`, and a
random `AUTH_SECRET` of at least 32 bytes in the root `.env`. For a local
development secret, generate one with:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

Register `http://localhost:3000/api/auth/callback/minecert-oidc` as the
provider callback URL. The provider must return an explicit
`email_verified: true` claim. Sign-in is available at `/sign-in`; verified
OIDC identities are stored separately from MineCert users. OIDC sign-in does
not grant organisation membership or access to tenant data. The API
authorization guard is a subsequent milestone.

## Planned foundation milestones

1. Establish the pnpm workspace and shared tooling. **Complete.**
2. Add PostgreSQL with Docker Compose and a Prisma schema/migration for the
   initial foundation entities. **Complete.**
3. Add the NestJS API, configuration validation, health endpoint, and
   OpenAPI documentation. **Complete.**
4. Add the Next.js landing/dashboard shell. **Complete (illustrative preview).**
5. Add configurable OIDC sign-in and verified identity linking. **Complete.**
6. Add backend-enforced organisation membership and permissions.
7. Implement equipment registration end-to-end.
8. Add setup, architecture, API, database, product, and decision
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
Only liveness and database-readiness routes are implemented. OIDC sign-in is
available in the web app, but API authentication, organisation authorization,
and domain endpoints remain planned.

## Web preview

The Next.js App Router application provides a responsive, Tailwind-enabled
workspace dashboard shell. The displayed organisation, user, equipment,
certificate, and activity details are sample content only. Auth.js supports a
configurable OIDC provider and records verified external identities. The web
app does not yet call the API or perform equipment, document, certificate,
or inspection operations; API-level authentication and tenant authorization
are still required before exposing business data.
