# Hemera E2E Test Suite

End-to-end tests cover the production experience end users should see. This README reflects the
current, trimmed-down suite that favors fast, deterministic feedback in CI.

## Current Specs

- `authentication.spec.ts` – customer login surface and degraded auth states
- `authorization.spec.ts` – role-driven navigation contracts
- `dashboard.spec.ts` – dashboard shell sanity checks
- `health.spec.ts` – uptime signal from the API
- `payment.spec.ts` – booking and checkout confirmation UI
- `performance.spec.ts` – Core Web Vitals guardrails
- `providers.spec.ts` – configuration smoke tests for identity providers

Support files of note:

- `global-setup.ts` – env bootstrap for Playwright
- `auth-helper.ts` – Clerk specific flows for local development

## Running Tests

```bash
# standard run (local dev)
npm run test:e2e

# focus a single spec
npx playwright test tests/e2e/dashboard.spec.ts

# interactive mode for exploring failures
npx playwright test --ui

# run the CI profile locally (uses static fixtures)
CI=1 npm run test:e2e
```

## Local vs CI Behavior

- **Local development** exercises the real Next.js app, including Clerk auth flows and server
  responses. Use this mode to validate integration logic end-to-end.
- **CI runs** short-circuit network fetches by rendering static HTML fixtures inside the browser
  context. The fixtures live at the bottom of each spec (for example `renderMockDashboard`). Keeping
  CI deterministic avoids flakiness when external services are unavailable.
- When adding new assertions, update the production DOM expectation and the paired fixture together
  so CI and local runs stay in sync.

## Roadmap

- Decide whether the fixture approach is a final state or a bridge. If we revert to app-driven
  navigation later, consider MSW or Next.js mock routes to retain determinism.
- Automate drift detection between real pages and fixtures (for example a periodic local script that
  snapshots both versions).
- Expand coverage once upstream services stabilize. Prime candidates: full Stripe happy-path in test
  mode and richer dashboard CRUD flows.

## Conventions

1. File naming: `feature-name.spec.ts`
2. Tests describe user observable behavior in plain language
3. Screenshots and traces are captured automatically on failure
4. Default timeout is 30s for auth heavy flows, 10s elsewhere unless documented inline
5. Chromium is the primary browser; only opt into others when required by acceptance criteria
