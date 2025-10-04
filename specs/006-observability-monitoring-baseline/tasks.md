# Tasks: 006-observability-monitoring-baseline

Legend: [P] can be done in parallel

## Tests First

- [x] T001 [P] Unit: logger outputs JSON with level/message/timestamp (add
      `tests/unit/logger.spec.ts`)
- [x] T002 [P] Unit: redact helper masks PII-like keys (email, name) (extend
      `tests/unit/logger.spec.ts`)
- [x] T003 Integration: middleware assigns `x-request-id` if missing and preserves if present (add
      `tests/integration/request-id.spec.ts`)
- [ ] T004 Integration: when Sentry disabled (no DSN), app runs and logger still works without
      external calls (add `tests/integration/sentry-disabled.spec.ts`)
- [ ] T005 Manual: With DSN in a non-prod sandbox, throwing error in a route results in Sentry event
      tagged with `requestId`

## Implementation

- [x] T006 Create `lib/observability/logger.ts` with JSON logger and redact helper
- [x] T007 Create `middleware.ts` request-id propagation (respect existing `x-request-id`)
- [x] T008 Create `lib/observability/request-context.ts` to read headers() and expose
      `getRequestId()`
- [x] T009 Sentry init wrappers: `sentry.client.config.ts`, `sentry.server.config.ts` (guarded by
      env and sampling)
- [x] T010 Add minimal Web Vitals handler hook in `app/layout.tsx` (no-op by default)

## Docs

- [x] T011 Add `docs/observability.md` with env vars, sampling, privacy safeguards, and runbook (how
      to find errors by requestId)
- [ ] T012 Update `README.md` badges/section with observability notes

## Quality Gates

- [ ] Lint, typecheck, docs gates pass (Markdown/spell/link)
