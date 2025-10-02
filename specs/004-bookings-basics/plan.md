# Implementation Plan: 004-bookings-basics

**Branch**: `004-bookings-basics` | **Date**: 2025-10-01 | **Spec**: `./spec.md`
**Input**: Feature specification from `/specs/004-bookings-basics/spec.md`

## Summary

Introduce minimal bookings capability in the protected area: create a booking and list user’s bookings. Respect Node runtime (Prisma/NextAuth), SSR for non-public, and domain segmentation (noindex).

## Technical Context

**Language/Version**: TypeScript 5.x  
**Primary Dependencies**: Next.js (App Router), Prisma Client, NextAuth.js, @mui/material  
**Storage**: PostgreSQL (Prisma)  
**Identity**: NextAuth.js with Prisma Adapter  
**Testing**: Vitest + Playwright  
**Target Platform**: Vercel (SSR Node for protected)  
**Project Type**: web (Next.js app)

## Constitution Check

PASS (v1.7.0): Non-public routes use Node SSR, server-side auth, and noindex; Prisma on Node only.

## Rendering Strategy Matrix

| Route                        | Strategy | Revalidate | Runtime | SEO Critical |
|------------------------------|----------|-----------:|---------|--------------|
| /protected/bookings          | SSR      |          - | node    | No           |
| /protected/bookings/new      | SSR      |          - | node    | No           |
| /api/bookings (actions)      | SSR      |          - | node    | No           |

Notes:

- Use server actions or route handlers on Node only; use Prisma safely with pooling.
- Ensure server-side `getServerSession` checks for all protected routes.
- Apply noindex headers/meta for protected pages.
 
## Phase 0: Outline & Research

- Define minimal Prisma model for `Booking` with User and Course references.
- Decide on unique constraint to prevent duplicate identical bookings.

## Phase 1: Design & Contracts

- Define UX flows (create, list) with MUI components and accessible feedback.
- Define API/Server Action contracts (input validation, error modes, success payloads).
- Update `prisma/schema.prisma`: Booking model and relations; plan migration.

## Phase 2: Task Planning Approach

- Generate tests for Booking create/list; then implement to pass.

## Branching & CI Gates

- Follow branch naming; ensure docs gates pass and migrations run via `prisma migrate deploy` on deploy.

## Progress Tracking

- [ ] Phase 0 complete
- [ ] Phase 1 complete
- [x] Phase 2 tasks generated (see `/specs/004-bookings-basics/tasks.md`)
- [ ] Implementation complete
- [ ] Validation passed
