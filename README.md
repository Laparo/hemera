# Hemera – Specs-first Workspace

This repository is currently in a planning/documentation phase. Features are defined and refined
under `specs/` using a specs-first workflow. Implementation follows a structured approach with
automated code review and quality assurance through Qodo PR Agent integration.

## Workflow

1. Specify a feature in `specs/<###-slug>/spec.md`.
2. Plan the implementation in `plan.md` (no code changes; no `tasks.md` created yet).
3. Generate tasks (`tasks.md`) for the feature (separate step).
4. Implement strictly following the tasks and constitution.

See `.github/prompts/*.prompt.md` and `.specify/templates/*` for automation guidance.

## Quality Gates (Docs)

Automated checks run on pull requests and on main:

- Markdown lint: `.markdownlint.jsonc`
- Spell check (cspell): `.cspell.json`
- Link check (lychee): `.lychee.toml`

Workflows live in `.github/workflows/` and are tuned to be helpful but not noisy. If a check fails,
address the reported issues or amend the configuration where appropriate.

## Deployment Pipeline

Structured CI/CD pipeline enforces constitutional quality gates:

### Quality Gates (Code)

All deployments must pass:

- TypeScript compilation (`npx tsc --noEmit`)
- Prettier formatting (`npm run format:check`)
- ESLint validation (`npm run lint:ci`)
- Unit tests (`npm test`)
- Build verification (`npm run build`)

### Deployment Process

- **Pull Requests**: Automatic preview deployment to Vercel with unique URL
- **Main Branch**: Production deployment to Vercel after all quality gates pass
- **Post-Deployment**: E2E tests run against live production environment
- **Rollback**: Immediate rollback capability for failed deployments

See `.github/workflows/deploy.yml` for complete pipeline configuration.

### Live Monitoring (Constitutional Requirement)

All Deploy workflows (Preview and Production) MUST be actively monitored using the official GitHub
Actions VS Code extension:

- Keep the workflow run view open and follow logs until completion
- Verify final status and collect the deployment URL
- Review artifacts (e.g., Playwright report) when present

Failure to monitor constitutes a process violation per the constitution
(`.specify/memory/constitution.md`).

## Ops / Runbooks

- Branch Hygiene: `docs/ops/branch-hygiene.md`
- Route Cleanup & Redirects: `docs/ops/route-cleanup-redirects.md`
- Linear MCP Server: `docs/ops/linear-mcp.md`

## Structure

- `specs/001-...` – Database/Auth/UI baseline (plan-only enforced)
- `specs/002-...` – Public SEO pages
- `specs/003-...` – Protected area shell
- `specs/004-...` – Bookings basics
- `specs/005-...` – Access segmentation middleware
- `specs/006-...` – Observability baseline
- `specs/007-public-academy` – Public academy info and bookable courses

## Notes

- Constitution is in `/.specify/memory/constitution.md`.
- Keep documentation in English.
- Use Material Design (MUI) when UI work begins.
- Stripe integration for secure payment processing and course enrollment.
- All payment flows must use Stripe test mode during development.

## Local Development Tips

- Ensure valid Clerk keys are set in your local env file for authentication flows. Example for
  `.env.local`:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY=YOUR_SECRET_KEY`

  Do not commit real keys. `.gitignore` already excludes `.env*` files.

## Tests & Troubleshooting

- Jest not exiting? Check for open handles:
  - Run tests with `--detectOpenHandles` to identify hanging timers/handles.
  - This repo had a global auto-cleanup interval in `lib/analytics/request-analytics.ts`. It is
    disabled in test/E2E environments and can be explicitly stopped via
    `stopRequestAnalyticsScheduler()`.
  - If you introduce global timers, ensure they are gated during tests (`NODE_ENV === 'test'` or
    `JEST_WORKER_ID`) or cleaned up in a teardown.
  - Database/containers: If you use Testcontainers, ensure proper teardown (`afterAll`) and call
    `prisma.$disconnect()` after DB tests.

## Tests

### Unit & Contracts

```bash
npm run test:unit
npm run test:contracts
```

### E2E (Playwright)

Standard (Playwright startet lokalen Dev-Server auf :3000, sofern frei):

```bash
npx playwright test
```

UI-Runner:

```bash
npx playwright test --ui
```

Headed-Modus:

```bash
npx playwright test --headed
```

#### Port und Base-URL steuern

Playwright unterstützt flexible Ports und Base-URLs:

- `PW_PORT`: Port, auf dem Playwright den lokalen Next.js-Server startet (Default: `3000`).
- `PLAYWRIGHT_BASE_URL`: Absolute Base-URL (z. B. Vercel Preview/Prod). Wenn gesetzt, startet
  Playwright keinen lokalen Server.
- `PW_WEB_SERVER_COMMAND`: Optional eigener Startbefehl. Standard ist `npx next dev -p $PW_PORT`.

Beispiele:

```bash
# Lokal auf Port 3002, Playwright startet Next selbst
PW_PORT=3002 npx playwright test

# Gegen laufenden lokalen Server (keinen Server starten)
PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test

# Gegen Vercel-Preview mit SSO-Bypass-Header (CI setzt Secret)
PLAYWRIGHT_BASE_URL=https://<vercel-preview>.vercel.app npx playwright test

# Eigenen Startbefehl nutzen (z. B. Production-Build)
PW_PORT=3002 PW_WEB_SERVER_COMMAND='next start -p 3002' npx playwright test
```
