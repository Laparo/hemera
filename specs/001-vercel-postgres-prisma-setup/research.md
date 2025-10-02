# Research: Vercel Postgres + Prisma + NextAuth + MUI

## Decisions

- Database: Vercel Postgres (Neon) managed instance via Prisma
- Prisma URLs: DATABASE_URL = POSTGRES_PRISMA_URL; DIRECT_URL = POSTGRES_URL_NON_POOLING
- Identity: NextAuth.js with Prisma Adapter; Provider: GitHub OAuth (initial)
- Runtime: Node for any Prisma usage (auth route, server-only modules)
- UI: Material Design via MUI with AppRouterCacheProvider + CssBaseline

## Rationale

- Vercel template provides best-practice defaults and seamless env wiring
- Prisma migrations enable consistent schema evolution in CI/CD
- NextAuth + Prisma Adapter integrates identity with the same Postgres
- MUI aligns with the constitution’s UI system and supports SSR well

## Alternatives Considered

- Supabase: first-class Postgres + auth, but we standardize on NextAuth
- SQLite (LibSQL): simpler local dev, but Vercel Postgres chosen for prod
- Other UI kits (Chakra, Ant): conflict with Material Design principle
