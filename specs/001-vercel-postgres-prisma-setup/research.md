# Research (Phase 0): Vercel Postgres + Prisma + NextAuth + MUI

Date: 2025-10-01
Feature: 001-vercel-postgres-prisma-setup
Spec: /specs/001-vercel-postgres-prisma-setup/spec.md

## Decisions

- Sessions: JWT (stateless)
- PR previews DB: Ephemeral DB per PR (clone/branch), migrate/seed on deploy, auto tear-down on PR close/merge
- DB connection strategy: Neon pooled connection string on Vercel (connection pooling)
- Signup policy: Open (no org/domain restriction)
- Providers: Email, Google, Apple, Instagram
- Database: Vercel Postgres (Neon) managed instance via Prisma
- Prisma URLs: Use pooled DATABASE_URL for Vercel; DIRECT_URL for migrations/Studio as needed
- Runtime: Node for any Prisma usage (auth route, server-only modules)
- UI: Material Design via MUI with AppRouterCacheProvider + CssBaseline

## Rationale

- JWT sessions: Serverless-friendly, low latency, sufficient for MVP; can upgrade to DB sessions if invalidation needs arise.
- Ephemeral DB per PR: Isolation, reliable migrations testing, cheap with Neon/Vercel Postgres branching; avoids collisions.
- Neon pooling: Simple and cost-effective; Accelerate optional later if connection churn is observed.
- Open signup: Reduces friction and simplifies go-live.
- Provider set: Covers passwordless and major OAuth providers; Instagram/Apple may require special handling for email-less identities.
- Prisma migrations: consistent schema evolution in CI/CD.
- MUI aligns with Material Design and supports SSR well.

## Alternatives Considered

- DB sessions (NextAuth Prisma sessions): Higher complexity; only needed for immediate global invalidation.
- Shared staging DB for previews: Risk of conflicts and non-determinism across PRs.
- Prisma Accelerate: Adds managed proxy; useful at higher scale or spiky traffic; defer for now.
- Restricted signup (Org/Domain): Not needed for public MVP.
- Supabase auth: We standardize on NextAuth for identity.

## Best Practices & Notes

- NextAuth on Node runtime; Prisma unsupported on Edge.
- Handle providers without email via (provider, providerAccountId) as canonical key; allow optional user-provided email later.
- Email uniqueness: enforce uniqueness only when email IS NOT NULL (partial unique index at SQL level). This avoids duplicates when providers (e.g., Apple/Instagram) omit email, while still ensuring uniqueness when an email exists.
- Ensure robots: noindex on non-public/protected pages; SSG/ISR for SEO pages.
- Seed data should be idempotent; use transactions to avoid partial states.
- Configure preview teardown with safety checks; log evidence for verification.

## Appendix (optional): SQL partial unique index for email

Using a partial unique index in PostgreSQL enforces uniqueness only when an email exists, allowing providers that omit email to link accounts by `(provider, providerAccountId)` without collisions.

```sql
-- Unique only for non-null emails
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_not_null
	ON "User" (email)
	WHERE email IS NOT NULL;
```

Notes (conceptual):
- Prisma schema does not model partial unique indexes directly. Define this in the migration SQL (manually editing the generated migration) or via a one-off SQL step.
- Keep `email` nullable in the Prisma model; avoid `@unique` on `email` in Prisma to prevent strict uniqueness across NULLs.
- Continue to rely on the composite unique `(provider, providerAccountId)` for provider linking.
