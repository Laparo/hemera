# Vercel team & environment setup

This document captures the Vercel organization/project IDs and the required environment variables across environments.

## Identification

- Org ID: `team_zgkd4GJxP3Zhj3ksAwQKn7CG`
- Project ID: `prj_kEstjhNCbZ644s0UgQ22MI0AQi4i`
- Project Name: `hemera`

These values come from `.vercel/project.json` and should not be changed manually. If the Vercel project changes, re-run `vercel link`.

## Environments

We use three environments with consistent variable names:

- Development (local): `.env.local`
- Preview (Vercel PR builds): configured in Vercel Project Settings → Environment Variables (scope: Preview)
- Production (Vercel main deploy): configured in Vercel Project Settings → Environment Variables (scope: Production)

## Variable matrix

Required

- `NEXT_PUBLIC_APP_ENV` — one of `development|preview|production`
- `NEXT_PUBLIC_APP_URL` — base URL of the app for links
- `DATABASE_URL` — Postgres connection string (Neon/Vercel Postgres), use pooled DSN on Vercel
  - Hinweis: Für lokale Entwicklung kannst du Werte via `vercel env pull .env.development.local` ziehen.
- `NEXTAUTH_URL` — external URL of the app per environment
- `NEXTAUTH_SECRET` — strong secret for JWT encryption

Providers (optional; configure the ones you use)

- Email: `EMAIL_SERVER`, `EMAIL_FROM`
- Google: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- Apple: `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY`
- Instagram: `INSTAGRAM_CLIENT_ID`, `INSTAGRAM_CLIENT_SECRET`

Observability (optional)

- `SENTRY_DSN`

Vercel CI-only (as GitHub Secrets, not app env)

- `VERCEL_ORG_ID` = `team_zgkd4GJxP3Zhj3ksAwQKn7CG`
- `VERCEL_PROJECT_ID` = `prj_kEstjhNCbZ644s0UgQ22MI0AQi4i`
- `VERCEL_TOKEN` — personal/automation token (avoid storing locally; use GitHub Secrets)

## Setup steps

1. Local development

- Copy `.env.example` to `.env.local` (oder nutze `.env.development.local`) und fülle Werte für deine Maschine
- Login: `vercel login` (device flow) and ensure `vercel whoami` shows your account
- Start dev: `vercel dev`

1. Vercel environment variables

- Go to Vercel → Project `hemera` → Settings → Environment Variables
- Add variables for `Preview` and `Production` with the same names as in `.env.example`
- Use pooled Neon DSN for serverless runtimes; include `?sslmode=require&schema=hemera`
  - Achte auf `?sslmode=require&schema=hemera` in der DSN. Für Previews unbedingt die gepoolte DSN verwenden.
  - Migrationsreihenfolge: Zuerst die Initialmigration (`init`), danach die partielle Unique‑Index‑Migration auf `User.email`.

1. GitHub Secrets (for CI/CD)

- In the GitHub repo → Settings → Secrets and variables → Actions
- Add: `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `VERCEL_TOKEN`
- Add provider secrets as needed (e.g. `GOOGLE_CLIENT_ID`, etc.)

1. Performance CI (Lighthouse)

- Use the workflow `.github/workflows/lighthouse-ci.yml`.
- Preferred: Trigger manually via `workflow_dispatch` and provide the Preview URL as input (`url`).
- Alternative: Provide a `PREVIEW_URL` environment variable from a previous step or a repository environment and the job will consume it automatically.

## Notes

- Never commit real secrets. `.env.local` is gitignored.
- Prefer Vercel’s Neon integration to provision per-Preview databases automatically.
- If you rotate Org/Project IDs, update GitHub Secrets accordingly and re-run `vercel link` locally.

### Preview-Datenbank-Schema in Vercel

- Die App erkennt in Vercel-Preview-Deployments das Pull-Request-Schema automatisch anhand der Umgebungsvariablen `VERCEL_ENV=preview` und `VERCEL_GIT_PULL_REQUEST_ID`.
- Es wird das Schema `hemera_pr_<PR_ID>` verwendet. Manuelle Overrides sind weiterhin via `PREVIEW_SCHEMA` oder `PR_SCHEMA` möglich.
- Stelle sicher, dass deine `DATABASE_URL` in Vercel eine gepoolte DSN (Neon/Vercel) mit `sslmode=require` ist; den `schema`-Parameter setzt die App zur Laufzeit.

### E2E-Variablen für Preview-Deployments

Für E2E-Auth-Flows in Preview-Deployments setze folgende Variablen (Scope: Preview):

- `E2E_EMAIL_CAPTURE` (z. B. `1`)
- `E2E_AUTH` (leer oder `credentials`)
- `E2E_TEST_PASSWORD` (nur bei `E2E_AUTH=credentials`)

Du kannst diese Variablen manuell in den Vercel Project Settings setzen oder den Workflow `.github/workflows/vercel-e2e-env.yml` verwenden (benötigt `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` als GitHub Secrets). Nach Änderungen ein neues Preview-Deployment auslösen.
