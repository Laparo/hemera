# Implementation Plan: 003-protected-area-shell

**Branch**: `003-protected-area-shell` | **Date**: 2025-10-01 | **Spec**: `./spec.md`
**Input**: Feature specification from `/specs/003-protected-area-shell/spec.md`

## Summary

Create a protected app shell (layout + navigation) for authenticated users, SSR on Node, using MUI with proper SSR styling.

## Technical Context

**Language/Version**: TypeScript 5.x  
**Primary Dependencies**: Next.js (App Router), NextAuth.js, @mui/material  
**Identity**: NextAuth.js with Prisma Adapter (from 001)  
**Runtime**: Node for protected routes  
**Testing**: Playwright smoke; unit for auth helpers

## Constitution Check

PASS (v1.7.0): Private routes SSR Node, server-side auth, MUI SSR styling.

## Rendering Strategy Matrix

| Route          | Strategy | Revalidate | Runtime | SEO Critical |
|----------------|----------|-----------:|---------|--------------|
| /protected     | SSR      |          - | node    | No           |
| /protected/*   | SSR      |          - | node    | No           |

## Design Notes

- Protected layout with top navigation; integrates session state on server.
- Use `getServerSession` for auth guard in server components.
- MUI App Router SSR: `AppRouterCacheProvider`, `CssBaseline`, avoid FOUC.

## Phase 0/1 Notes

- Define initial protected pages and structure (`(protected)` segment).
- Confirm Node runtime annotations where needed.
- Draft minimal tests for auth-gate and layout presence.

## Progress Tracking

- [ ] Phase 0 complete
- [ ] Phase 1 complete
- [x] Tasks generated (see `/specs/003-protected-area-shell/tasks.md`)
- [ ] Implementation complete
- [ ] Validation passed
