# Feature Spec: 006-observability-monitoring-baseline

**Title**: Observability & Monitoring Baseline (Sentry + Structured Logging + Request Correlation)  
**Status**: Proposed  
**Version**: 1.0  
**Date**: 2025-10-01

## Summary

Establish a production-grade observability baseline for the app: error tracking, structured logging,
and request correlation. This enables actionable diagnostics in production and non-intrusive
telemetry in development, while respecting privacy and the public vs. non-public domain
segmentation.

## In Scope

- Error tracking with Sentry SDK for Next.js (browser + Node) with environment gating and sampling.
- Structured, JSON-formatted logging utility with severity levels and PII redaction helpers.
- Request correlation via `x-request-id` propagation (middleware + logger + Sentry scope/trace
  context).
- Basic Web Vitals export and optional Vercel Analytics for public pages (no PII).
- Minimal runbook and environment variable documentation.

## Out of Scope

- Full distributed tracing pipeline (OpenTelemetry exporter to a backend like Azure App
  Insights/Datadog).
- Business dashboards/SLIs beyond basic error rate and page performance.
- Alert routing/on-call rotations.

## Goals

- Quickly pinpoint and reproduce production errors with context (request ID, URL, user anon ID if
  consented).
- Enable consistent, parseable logs to aid debugging across environments.
- Avoid leaking sensitive data; comply with privacy expectations (no PII by default; explicit
  consent gating if user data would be attached).

## Non-Goals

- Vendor lock-in to a single APM/observability provider. The design should keep SDK usage
  encapsulated.

## Functional Requirements

- FR-001: System MUST capture unhandled exceptions and promise rejections on server and client when
  enabled via env (e.g., `SENTRY_DSN`).
- FR-002: System MUST provide a structured logging API with levels (debug, info, warn, error) and
  JSON output including timestamp and requestId when available.
- FR-003: System MUST propagate a `x-request-id` header through middleware and make it accessible in
  server logs and Sentry scope for correlation.
- FR-004: System SHOULD record Web Vitals and basic page performance metrics on public pages without
  storing PII.
- FR-005: System MUST allow opt-out in non-production environments by default (no network telemetry
  unless explicitly enabled).
- FR-006: System MUST not include user-identifying information in logs/telemetry unless explicit
  consent has been recorded (future extension; default is OFF).

## Non-Functional Requirements

- NFR-001: Overhead minimal: added latency and bundle impact within reasonable bounds (SDK loaded
  conditionally; sampling configured).
- NFR-002: Privacy-first: defaults avoid PII; configurable via env; clear documentation.
- NFR-003: Compatibility with Next.js App Router and our Node-only constraints for Prisma/auth.

## Acceptance Criteria

- AC-001: With `SENTRY_DSN` set and `NODE_ENV=production`, throwing an error in a server route
  results in an event visible in Sentry with request URL and requestId tag.
- AC-002: Logs produced by the server include JSON fields: `level`, `message`, `timestamp`, and
  `requestId` when present.
- AC-003: Public pages continue to be crawlable; no telemetry blocks or alters SEO-critical
  responses; private pages remain noindex (per separate features), telemetry adheres to privacy
  defaults.
- AC-004: When `SENTRY_DSN` is not set, the app builds and runs with telemetry disabled; no external
  calls performed.

## Dependencies & Constraints

- Next.js (App Router).
- Node runtime for middleware and server SDK; optional edge SDK is deferred.
- Vercel environment variables for DSN and sampling control.

## Constitution Check (v1.7.0)

- Respects Domain & Access Segmentation: no change to public vs. non-public routing/SEO.
- Hybrid rendering unaffected; error tracking hooks in but doesn’t force SSR on public pages.
- Node runtime used where Prisma/auth exist; observability does not violate those constraints.
