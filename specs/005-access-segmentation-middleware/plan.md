# Implementation Plan: 005-access-segmentation-middleware

**Branch**: `005-access-segmentation-middleware` | **Date**: 2025-10-01 | **Spec**: `./spec.md`
**Input**: Feature specification from `/specs/005-access-segmentation-middleware/spec.md`

## Summary

Centralize access segmentation: enforce auth for non-public routes and set noindex for them. Respect
Node runtime for Prisma/NextAuth server-side checks.

## Technical Context

**Language/Version**: TypeScript 5.x  
**Primary Dependencies**: Next.js (App Router), NextAuth.js  
**Storage**: N/A  
**Identity**: NextAuth.js (server check via getServerSession)  
**Testing**: Playwright/E2E redirects; unit tests for headers

## Constitution Check

PASS (v1.7.0): Implements Principle XI and Node-only SSR for auth-related checks.

## Design

- Define protected matchers: `(protected)` segment; explicit patterns like `/dashboard`, `/account`,
  `/materials`.
- Middleware behavior: unauthenticated → redirect to sign-in with return URL; authenticated →
  continue.
- Non-public pages: set `noindex` via headers/meta (robots `noindex, nofollow`).
- Ensure Node runtime for routes that use Prisma/NextAuth server APIs (document in affected routes).

## Tasks Outline

- Define route patterns and configuration
- Implement `middleware.ts` with minimal overhead
- Add helper to set `noindex` meta/headers server-side
- Tests: unauth redirect, auth pass-through, public unaffected; avoid redirect loops; verify headers
  present
- Admin APIs: Audit all `/api/admin/*` routes and ensure server-side admin guards are enforced
  consistently (add guards/tests where missing).

## Progress Tracking

- [x] Phase 0 — Research present (`research.md`)
- [x] Phase 1 — Specs/contracts scaffolded (`contracts/`, `quickstart.md`)
- [x] Phase 2 — Tasks generated (`tasks.md`)
- [ ] Design finalized
- [ ] Implementation complete
- [ ] Validation passed
