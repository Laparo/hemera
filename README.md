# Hemera – Specs-first Workspace

[![Deploy - Vercel](https://github.com/Laparo/hemera/actions/workflows/vercel-deploy.yml/badge.svg?branch=main)](https://github.com/Laparo/hemera/actions/workflows/vercel-deploy.yml)

## Deployment

Deployments laufen ausschließlich über GitHub Actions via Vercel CLI (Vercel Git-Integration ist deaktiviert, um Doppeldeploys zu vermeiden).

### Try it (optional)

Öffne einen Test-PR: kleine README-Änderung → PR gegen main. Der Workflow „Deploy - Vercel“ erzeugt eine Preview-URL sowie Lighthouse- und E2E-Kommentare im PR. Required Checks blockieren den Merge, bis alles grün ist.

This repository is currently in a planning/documentation phase. Features are defined and refined under `specs/` using a specs-first workflow. No application code has been committed yet; implementation starts only after tasks are generated and approved.

## Workflow

1. Specify a feature in `specs/<###-slug>/spec.md`.
2. Plan the implementation in `plan.md` (no code changes; no `tasks.md` created yet).
3. Generate tasks (`tasks.md`) for the feature (separate step).
4. Implement strictly following the tasks and constitution.

See `.github/prompts/*.prompt.md` and `.specify/templates/*` for automation guidance.

## Issues

Please use our issue templates and labels to keep work structured:

- New issues: use the templates under `.github/ISSUE_TEMPLATE/` (bug/feature)
- Labels: defined in `.github/labels.yml` and synced via the "Labels - Sync" workflow
- Auto-triage: new issues get `status:triage` via the "Issues - Triage" workflow
- Vercel ↔ GitHub: deployment/runtime issues created via the Vercel integration follow the same triage/labeling rules

Refer to the Constitution (`.specify/memory/constitution.md`) for detailed repository management rules.

## Quality Gates (Docs)

Automated checks run on pull requests and on main:
- Markdown lint: `.markdownlint.jsonc`
- Spell check (cspell): `.cspell.json`
- Link check (lychee): `.lychee.toml`

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
