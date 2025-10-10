# Hemera – Specs-first Workspace

This repository is currently in a planning/documentation phase. Features are defined and refined
under `specs/` using a specs-first workflow. No application code has been committed yet;
implementation starts only after tasks are generated and approved.

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
