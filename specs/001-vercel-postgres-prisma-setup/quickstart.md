# Quickstart (Phase 1)

This quickstart validates the user story end-to-end in a plan-only manner (no implementation executed here).

## Goals

- Sign in via any supported provider (Email, Google, Apple, Instagram) and access a protected page.
- Preview deployments provision isolated databases per PR (migrate/seed, auto tear‑down).

## Steps (Conceptual)

1. Configure environment variables (conceptual): NEXTAUTH_URL, NEXTAUTH_SECRET, provider credentials; Postgres pooled DSN.
2. Database: Apply migrations, seed minimal data (idempotent); use Neon pooled connection string on Vercel.
3. Auth route: App Router path `app/api/auth/[...nextauth]/route.ts` runs on Node runtime.
4. Protected route: Server-side `getServerSession` guard; non-public pages set robots noindex.
5. Preview: On PR create, clone DB/branch; run migrate+seed; on close/merge remove DB.

## Acceptance Checks (Conceptual)

- Provider login leads to protected page.
- Unauthenticated user is redirected to sign-in.
- Email magic link invalid/expired shows error and allows re-request.
- Provider without email links account via (provider, providerAccountId) without duplicates.
- PR DB is torn down and removal is evidential in logs.

## A11y Smoke Test (WCAG 2.1 AA intent)

- Alle interaktiven Elemente sind per Tastatur erreichbar (Tab-Reihenfolge korrekt)
- Sichtbarer Fokuszustand bei Buttons/Links/Inputs
- Buttons/Links haben aussagekräftige Labels/Text
- Farbkontrast erfüllt mindestens AA (Text/Icons)
- Semantische Überschriftenstruktur (h1 → h2 → …)

## Integration Test Mapping (Draft)

- Sign-in flow (Email/Google/Apple/Instagram) → Playwright scenario logs in and accesses `/protected`; expects redirect if unauthenticated.
- Providers endpoint → Fetch `/api/auth/providers`; expect array with configured providers.
- Health endpoint → Fetch `/api/health`; expect `{ status: 'ok' }`.
