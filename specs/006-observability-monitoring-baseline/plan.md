# Implementation Plan: 006-observability-monitoring-baseline

Branch: 006-observability-monitoring-baseline | Date: 2025-10-19 | Spec:
/specs/006-observability-monitoring-baseline/spec.md

## Execution Flow (/plan command scope)

Executed steps 1–7 as required. Phase 2 is only planned descriptively, not executed.

## Summary

Establish and formalize an observability baseline: Rollbar error tracking, structured JSON logging,
request correlation via x-request-id, privacy-first telemetry (PII only with consent), Web Vitals
only on public pages in production (env-gated, 100% sample), and clear retention defaults (30/14/7
days). The spec includes explicit Clarifications for sampling, request-id handling, consent model,
Web Vitals gating, and log retention.

## Technical Context

- Language/Version: TypeScript 5.9.x, Node.js 22.x, Next.js 15.x (App Router)
- Primary Dependencies: Rollbar SDK (server+browser wrappers in lib/monitoring), Prisma
  (PostgreSQL), Jest 30.x, Playwright, ESLint, Prettier
- Storage: PostgreSQL via Prisma (existing)
- Testing: Jest (unit/integration), Playwright (E2E)
- Target Platform: Vercel (inferred), GitHub Actions for CI/CD
- Project Type: web application (Next.js App Router)
- Performance Goals: minimal overhead; SDK loaded conditionally; no PII by default Constraints: p95
  latency unaffected materially; no console.error in prod (Rollbar mandatory per Constitution);
  deployments via GitHub Actions only; live monitoring of Deploy workflow Additionally: Keep
  vendor-specific code encapsulated behind lightweight wrappers; runtime is Node for middleware and
  server SDK.

## Constitution Check

Initial review against Constitution v1.9.0+ amendments:

- Deployment Standards: Using GitHub Actions with quality gates — compatible (no manual deploys)
- Error Monitoring: Rollbar mandatory; console.error prohibited — aligned (wrappers exist)
- Live Monitoring: Deploy workflows must be live-monitored via VS Code extension — not impacted by
  this plan but acknowledged in runbooks
- Privacy & Security: PII filtered; consent required — aligned

Result: PASS (no violations). Post-Design recheck also PASS.

## Project Structure

Documentation for this feature resides in `specs/006-observability-monitoring-baseline/`:

```text
specs/006-observability-monitoring-baseline/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    ├── headers.md
    ├── log-event.schema.json
    └── tests/
        ├── request-id.test.md
        ├── privacy-consent.test.md
        └── web-vitals.test.md
```

Source code relevant locations (existing):

- lib/monitoring/rollbar\*.ts, middleware.ts, lib/utils/request-id.ts
- app/api/health/deployment/route.ts, components/monitoring/DeploymentMonitoringDashboard.tsx

Structure Decision: Single Next.js web app; no new projects introduced. Contracts are
documentation-oriented (headers, JSON schema) rather than external API endpoints.

## Phase 0: Outline & Research

Unknowns resolved via Clarifications (Sampling, Request-ID, Consent/PII, Web Vitals, Retention).
Best practices captured in research.md.

Output: research.md

## Phase 1: Design & Contracts

Artifacts produced:

- data-model.md: Entities — TelemetryConfig, RequestContext, LogEvent, WebVitalEvent, ConsentState
- contracts/headers.md: Header contract for x-request-id (canonical vs. external)
- contracts/log-event.schema.json: JSON schema for structured logs
- contracts/tests/\*\.md: Failing contract test narratives for request-id, privacy/consent, web
  vitals
- quickstart.md: Enablement, env flags, verification steps mapped to AC-001..AC-007

- TDD for logger JSON shape; integration test for header propagation; feature flags for Rollbar.

Output: data-model.md, contracts/\*, quickstart.md

## Phase 2: Task Planning Approach (for /tasks)

- Generate tasks from the above artifacts; emphasize TDD (contract tests first)
- Parallelize independent items (e.g., schema validation vs. env gating checks)
- Ensure Rollbar console.error elimination checks included in lint rules/tests

Estimated: ~15-20 tasks (fewer endpoints, focus on integration & verification)

## Phase 3+: Future Implementation

Beyond /plan scope.

## Complexity Tracking

N/A — no constitutional deviations.

## Existing Implementation Inventory (to consider)

The repository already contains a substantial part of this baseline. New work must extend or
integrate with these modules rather than duplicating them:

- Rollbar integration wrappers and helpers:
  - `lib/monitoring/rollbar.ts`
  - `lib/monitoring/rollbar-official.ts`
  - `components/monitoring/DeploymentMonitoringDashboard.tsx`
- Request correlation and middleware:
  - `lib/utils/request-id.ts`
  - `middleware.ts` (propagates/sets `x-request-id`)
  - `lib/monitoring/instrumentation.ts`
- Deployment monitoring endpoints and docs:
  - `app/api/health/deployment/route.ts`
  - `docs/monitoring/deployment-monitoring-setup.md`
- Logging and analytics building blocks:
  - `lib/analytics/request-analytics.ts`
  - `lib/utils/api-logger.ts` (existing logger utilities)

Where applicable, the 006 tasks should reuse and evolve these artifacts, keeping the public APIs
stable and avoiding breaking changes.

## Deltas and next steps

- Confirm Rollbar env-gating across server and client wrappers (no telemetry by default in CI/dev).
- Add a lightweight integration test for "Rollbar disabled" behavior to ensure zero external calls.
- Optionally add a Web Vitals export hook gated behind env (no-op by default) if not already
  present.

## Progress Tracking

Phase Status:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

Gate Status:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

—

Based on Constitution v1.9.0 (see `/.specify/memory/constitution.md`)
