# Implementation Plan: 006-observability-monitoring-baseline

**Branch**: `006-observability-monitoring-baseline` | **Date**: 2025-10-01 | **Spec**: `./spec.md`
**Input**: Feature specification from `/specs/006-observability-monitoring-baseline/spec.md`

> Note – Documentation Quality Gates apply. See repo CI for Markdown, spelling, and link checks.

## Summary

Introduce an observability baseline: Sentry error tracking (conditionally enabled), structured
logging, and request correlation via `x-request-id`. Keep vendor-specific code encapsulated behind
light wrappers.

## Technical Context

**Language/Version**: TypeScript 5.x  
**Primary Dependencies**: Next.js (App Router), (optional) `@sentry/nextjs`  
**Runtime**: Node for middleware and server SDK  
**Testing**: Unit for logger; integration for request-id propagation; manual verification for Sentry
in non-prod sandbox  
**Target Platform**: Vercel

## Rendering Strategy Impact

None. Logging and telemetry are orthogonal to rendering strategy; ensure no SSR is introduced where
not needed.

## Design Notes

- Provide a small `lib/observability` module with a `logger` and `withRequestContext` helpers.
- Initialize Sentry only when env vars are present.
- Use middleware to set/propagate `x-request-id` if missing.
- Attach `requestId` to logs and Sentry scope (tag) when available.
- Provide a minimal Web Vitals handler exporting to console or a no-op by default.

## Phase 0: Outline & Research

- Validate Next.js App Router + `@sentry/nextjs` integration patterns (server and client).
- Evaluate request-id generation and safe propagation strategy.
- Define env var contract and sampling defaults.

## Phase 1: Design & Contracts

- Define `logger` interface and JSON schema.
- Define `getRequestId` helper and middleware interaction.
- Define Sentry init wrapper API surface for future portability.

## Phase 2: Task Planning Approach

- TDD for logger JSON shape; integration test for header propagation; feature flags for Sentry.

## Branching & CI Gates

- Follow branch naming; keep docs gates green (Markdown, spelling, link check).
- No external calls during CI unless explicitly allowed; Sentry disabled by default.

## Progress Tracking

- [ ] Phase 0 complete
- [ ] Phase 1 complete
- [x] Phase 2 tasks generated (see `/specs/006-observability-monitoring-baseline/tasks.md`)
- [ ] Implementation complete
- [ ] Validation passed
