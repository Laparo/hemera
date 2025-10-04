# Hemera – Specs-first Workspace

This repository is currently in a planning/documentation phase. Features are defined and refined under `specs/` using a specs-first workflow. No application code has been committed yet; implementation starts only after tasks are generated and approved.

## Workflow

1. Specify a feature in `specs/<###-slug>/spec.md`.
2. Plan the implementation in `plan.md` (no code changes; no `tasks.md` created yet).
3. Generate tasks (`tasks.md`) for the feature (separate step).
4. Implement strictly following the tasks and constitution.

See `.github/prompts/*.prompt.md` and `.specify/templates/*` for automation guidance.

## Quality Gates (Docs & Code)

Automated checks run on pull requests and on main:

### Documentation Quality
- Markdown lint: `.markdownlint.jsonc`
- Spell check (cspell): `.cspell.json`
- Link check (lychee): `.lychee.toml`

### Code Quality & Review
- **Qodo PR Agent**: Mandatory automated code review and approval
- TypeScript compilation and type checking
- ESLint linting (zero warnings required)
- Automated test suite (unit, integration, e2e)
- Performance monitoring with Lighthouse CI

### Non-Negotiable Requirements
All pull requests **MUST** pass Qodo PR Agent analysis before human review. This is enforced by our constitution and cannot be bypassed.

Workflows live in `.github/workflows/` and are tuned to be helpful but not noisy. If a check fails, address the reported issues or amend the configuration where appropriate.

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
