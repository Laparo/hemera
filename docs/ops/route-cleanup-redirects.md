# Runbook: Route-Cleanup und Redirects

Dieses Runbook beschreibt, wie wir Legacy-Routen auf neue Bereiche konsolidieren und Redirects
verwalten.

## Ziele

- Server-geschützte Inhalte leben unter `/admin`.
- Client-guarded UI lebt unter `/dashboard`.
- Legacy-Links aus `/protected/*` werden per 301 dauerhaft auf `/dashboard` umgeleitet.

## Implementierung

- Redirects sind in `next.config.mjs` definiert:
  - `source: /protected/:path*` → `destination: /dashboard`, `permanent: true`.
- Das alte Verzeichnis `app/protected` wurde entfernt.
- Middleware setzt für geschützte Bereiche `noindex` und wendet Zugriffskontrollen an.

## Tests

- Ein Playwright-E2E testet den Legacy-Redirect (`/protected → /dashboard`).
- Smoke-Tests prüfen `/` und `/dashboard` auf Erreichbarkeit.

## Betriebshinweise

- Redirect ist idempotent und SEO-freundlich (301).
- Bei neuen Konsolidierungen: Erst Redirect hinzufügen, dann alte Routen entfernen, anschließend E2E
  anpassen.
- Monitoring: 4xx/5xx-Spitzen im Zeitraum nach Release beobachten.

## Rollback

- Falls Probleme auftreten, Redirect-Eintrag in `next.config.mjs` vorübergehend entfernen oder Ziel
  auf `/` ändern, dann erneut bereitstellen.

## Version/Build-Info

- Der Footer zeigt eine kleine Build-Kennung: `v<version> (<shortSha>) · <env>`.
- Quelle:
  - Version: `package.json` (`version`) oder `NEXT_PUBLIC_APP_VERSION`.
  - Commit: `VERCEL_GIT_COMMIT_SHA`/`GITHUB_SHA`/`NEXT_PUBLIC_GIT_SHA`.
  - Env: `VERCEL_ENV` oder `NODE_ENV`.
