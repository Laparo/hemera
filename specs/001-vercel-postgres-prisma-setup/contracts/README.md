# Contracts

This setup feature does not introduce public business APIs. Contracts are limited to auth flows.

- OAuth callback endpoints (NextAuth route handler)
- Protected page requires authenticated session

Contract tests are represented as integration tests for auth and protected routes, rather than OpenAPI/GraphQL specs.

## OpenAPI source of truth

The authoritative OpenAPI specification lives here:

- `specs/001-vercel-postgres-prisma-setup/contracts/openapi.yaml`

Note: The previous file at the feature root (`specs/001-vercel-postgres-prisma-setup/openapi.yaml`) has been removed to avoid duplication. Use only this file.

## Endpoints included

- `GET /api/health` — simple health check returning `{ status: "ok" }`.
- `GET /api/auth/providers` — lists configured authentication providers.

These endpoints reflect the minimal surface for this setup feature (auth/health). No public business API is introduced in 001.

## Viewing the spec (optional)

- Use any OpenAPI viewer (e.g., Swagger Editor, Redocly) to load `contracts/openapi.yaml` locally.
- Keep this file as the single source; avoid editing or reintroducing the stub at the feature root.
