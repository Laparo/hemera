# Feature Spec: 006-observability-monitoring-baseline

**Title**: Observability & Monitoring Baseline (Rollbar + Structured Logging + Request Correlation)
**Status**: Completed **Version**: 1.0 **Date**: 2025-10-01

## Summary

Establish a production-grade observability baseline for the app: error tracking, structured logging,
and request correlation. This enables actionable diagnostics in production and non-intrusive
telemetry in development, while respecting privacy and the public vs. non-public domain
segmentation.

Note: The repository already contains key pieces of this baseline (Rollbar integration, request-id
propagation middleware, deployment monitoring endpoints and dashboard). This spec should be applied
by extending those parts rather than introducing parallel implementations.

## Clarifications

### Session 2025-10-19

- Q: How should telemetry sampling be standardized in production? → A: Error-first: 100% Errors,
  5% Non-Errors
- Q: What request-id strategy should we use at the trust boundary? → A: Generate canonical; log
  incoming only
- Q: What is the PII/consent model for telemetry? → A: PII off by default; consent required

## In Scope

- Error tracking with Rollbar SDK for Next.js (browser + Node) with environment gating and sampling.
  Existing wrappers are under `lib/monitoring/rollbar*.ts`.
- Structured, JSON-formatted logging utility with severity levels and PII redaction helpers.
- Request correlation via `x-request-id` propagation (middleware + logger + Rollbar scope/trace
  context). Existing helpers: `middleware.ts`, `lib/utils/request-id.ts`.
- Basic Web Vitals export and optional Vercel Analytics for public pages (no PII). If added, must be
  disabled by default via env gating.
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
  enabled via env (e.g., `ROLLBAR_SERVER_ACCESS_TOKEN` and
  `NEXT_PUBLIC_ROLLBAR_CLIENT_ACCESS_TOKEN`). Existing code should be verified rather than
  reimplemented.
- FR-002: System MUST provide a structured logging API with levels (debug, info, warn, error) and
  JSON output including timestamp and requestId when available.
- FR-003: System MUST propagate a `x-request-id` header through middleware and make it accessible in
  server logs and Rollbar scope for correlation. The server MUST always generate a canonical
  `requestId` (UUID) per request; if an inbound `x-request-id` exists, record it as
  `externalRequestId` for reference only. The response MUST include the canonical `x-request-id`.
- FR-004: System SHOULD record Web Vitals and basic page performance metrics on public pages without
  storing PII.
- FR-005: System MUST allow opt-out in non-production environments by default (no network telemetry
  unless explicitly enabled).
- FR-006: System MUST NOT include user-identifying information in logs/telemetry unless explicit
  consent has been recorded; default is OFF. Consent MUST be checked at emission time and revocation
  MUST take effect immediately for subsequent events.

## Non-Functional Requirements

- NFR-001: Overhead minimal: added latency and bundle impact within reasonable bounds (SDK loaded
  conditionally; sampling configured). Default production sampling: 100% errors; ~5% non-errors;
  overridable via environment configuration.
- NFR-004: Trust boundary protection: inbound `x-request-id` MUST NOT override the canonical server
  `requestId`; it is treated as untrusted metadata (`externalRequestId`).
- NFR-002: Privacy-first: defaults avoid PII. PII MAY only be attached when explicit and revocable
  consent has been recorded; behavior MUST be configurable via environment flags and documented.
- NFR-003: Compatibility with Next.js App Router and our Node-only constraints for Prisma/auth.

## Acceptance Criteria

- AC-001: With `ROLLBAR_SERVER_ACCESS_TOKEN` set and `NODE_ENV=production`, throwing an error in a
  server route results in an event visible in Rollbar with request URL and requestId tag.
- AC-002: Logs produced by the server include JSON fields: `level`, `message`, `timestamp`, and
  `requestId` when present.
- AC-003: Public pages continue to be crawlable; no telemetry blocks or alters SEO-critical
  responses; private pages remain noindex (per separate features), telemetry adheres to privacy
  defaults.
- AC-004: When `ROLLBAR_SERVER_ACCESS_TOKEN` is not set, the app builds and runs with telemetry
  disabled; no external calls performed.
- AC-005: Without recorded consent, telemetry/log payloads MUST NOT include user-identifying fields
  (e.g., email, name, userId). With recorded consent, including a pseudonymous user key is
  permitted; removing consent MUST prevent further inclusion immediately.

## Dependencies & Constraints

- Next.js (App Router).
- Node runtime for middleware and server SDK; optional edge SDK is deferred.
- Vercel environment variables for Rollbar tokens and sampling control.

## Constitution Check (v1.7.0)

- Respects Domain & Access Segmentation: no change to public vs. non-public routing/SEO.
- Hybrid rendering unaffected; error tracking hooks in but doesn’t force SSR on public pages.
- Node runtime used where Prisma/auth exist; observability does not violate those constraints.
