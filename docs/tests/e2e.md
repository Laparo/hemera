# E2E-Tests (Playwright)

Dieser Ordner enthält End-to-End-Tests mit Playwright. Die Tests validieren u. a. die API-Contracts und grundlegende Flows.

## Installation

```bash
npm install
npm run e2e:install
```

## Lokal ausführen

- Server lokal starten oder Preview-URL nutzen.
- Standardmäßig wird `http://localhost:3000` als Base-URL genutzt. Du kannst eine externe URL setzen:

```bash
PLAYWRIGHT_BASE_URL=https://hemera-<preview>.vercel.app npm run e2e:dev
```

Empfohlen ist der Build-Modus:

```bash
npm run e2e
```

Dieser Befehl baut die App (`next build`) und führt anschließend die Tests aus (`playwright test`).

## In CI (GitHub Actions)

- Workflow `.github/workflows/e2e.yml` führt die E2E-Tests gegen eine angegebene Base-URL aus.
- Übergib die Preview-URL als Eingabe oder setze environment `PLAYWRIGHT_BASE_URL` aus vorangegangenen Jobs.

### Vercel-Preview: E2E-Variablen setzen

Für die Auth-E2E-Flows müssen in der Vercel-Preview-Umgebung folgende Variablen gesetzt sein:

- `E2E_EMAIL_CAPTURE` (z. B. `1` zum Aktivieren des Magic-Link-Captures in eine Datei unter `/tmp`)
- `E2E_AUTH` (leer oder `credentials` für den Test-Login)
- `E2E_TEST_PASSWORD` (nur relevant, wenn `E2E_AUTH=credentials`)

Automatisiert geht das über den Workflow `.github/workflows/vercel-e2e-env.yml` (manuell startbar). Voraussetzung sind Repository-Secrets:

- `VERCEL_TOKEN` – Vercel Access Token
- `VERCEL_ORG_ID` – Team/Org ID
- `VERCEL_PROJECT_ID` – Projekt-ID

Nach dem Setzen der Variablen ist ein neues Preview-Deployment nötig, damit die Änderungen aktiv werden.

Hinweis: Der Lighthouse-Workflow setzt bereits `PREVIEW_URL`. Der E2E-Workflow kann diese übernehmen oder selbst auf `deployment_status` lauschen und die `target_url` direkt ziehen.

## Hinweise

- Die Tests verwenden den Playwright APIRequestContext (`request` fixture) für API-Checks.
- Für Previews mit per-PR-Schema nutzt die App automatisch `hemera_pr_<PR_ID>` (kein `schema` in der Vercel-DSN nötig).

### Auth-Flows (E2E)

- Email Magic Link (Capture)
  - Setze `E2E_EMAIL_CAPTURE=1` in der App-Umgebung (z. B. Vercel Preview oder lokal), damit die App den Magic-Link nach `/tmp/hemera-e2e-last-magic-link.txt` schreibt.
  - Stelle sicher, dass `NEXTAUTH_URL` der Base-URL entspricht (auch in Previews!).
  - Test: `tests/e2e/auth-email.spec.ts` (übersprungen, wenn `E2E_EMAIL_CAPTURE` nicht gesetzt ist).

- Credentials (nur Test-Modus)
  - Setze `E2E_AUTH=credentials` und optional `E2E_TEST_PASSWORD` (Default: `password`).
  - Test: `tests/e2e/auth-credentials.spec.ts` (übersprungen, wenn `E2E_AUTH` nicht `credentials` ist).
  - Hinweis: Der Credentials-Provider wird nur im Testmodus aktiviert und ist nicht für Produktion gedacht.

### Flaky/Fail-Fast

- Retries sind in CI auf 2 gesetzt. Passe `retries` in `playwright.config.ts` an.
- Du kannst die Projektmatrix erweitern (bspw. `webkit`, `firefox`) oder parallelisieren (`fullyParallel`).
- Fail-Fast in CI: Der E2E-Workflow kommentiert Ergebnisse und bricht am Ende ab, wenn Tests fehlgeschlagen sind; Logs/Report werden als Artifact hochgeladen.
