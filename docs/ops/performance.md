# Performance & Web Vitals

Diese Seite beschreibt, wie Performance validiert wird und welche Metriken wichtig sind.

## Lighthouse CI

- Siehe Workflow `.github/workflows/lighthouse-ci.yml` und `.lighthouserc.json` (Budget/Schwellenwerte)
- Standard: Desktop-Profil, 1 Run (CI-zeitoptimiert)

## Web Vitals (Empfehlung)

- LCP (Largest Contentful Paint)
- INP (Interaction to Next Paint)
- CLS (Cumulative Layout Shift)

### Erfassung (Optionen)

- Clientseitig via `web-vitals` Paket und Senden an Analytics/Logging-Endpunkt
- Oder via Vercel Web Analytics (falls aktiviert)

### Zielwerte (Richtwerte)

- LCP: < 2.5s (gut), < 4.0s (verbesserungswürdig)
- INP: < 200ms (gut), < 500ms (verbesserungswürdig)
- CLS: < 0.1 (gut)

### Umsetzung (später)

- Implementiere eine kleine `lib/metrics/vitals.ts` und sende Werte an ein Logging-Backend
- Dokumentiere die Ergebnisse pro Umgebung in diesem Dokument

## Performance validation (Detail)

This section describes how we validate performance for Preview and Production deployments.

### Goals

- Maintain a good Performance score in Lighthouse (>= 0.8)
- Keep Core Web Vitals healthy: LCP <= 3s (median), CLS <= 0.1, INP (or FID) within good thresholds
- Detect regressions early in CI for Preview deployments

### Thresholds (initial)

- Lighthouse categories
  - Performance: >= 0.80 (error below)
  - Accessibility: >= 0.90 (warn below)
- Metrics (median)
  - Largest Contentful Paint (LCP): <= 3000 ms
  - Cumulative Layout Shift (CLS): <= 0.10
  - Interaction to Next Paint (INP) or First Input Delay (FID): keep within "good" per Lighthouse

### CI Integration (Lighthouse CI)

- Workflow: `.github/workflows/lighthouse-ci.yml`
- Triggers:
  - Manual via `workflow_dispatch` with an URL input.
  - Automatically on `deployment_status` events from GitHub (e.g., the Vercel GitHub App). The workflow extracts the preview URL from the event payload and runs Lighthouse only for successful, non-production deployments.
- The job falls back to an environment variable `PREVIEW_URL` if set and will skip when no URL is provided.

### Local verification

- You can run Lighthouse locally against `vercel dev` on <http://localhost:3000> for a quick smoke test.
- Keep in mind local scores can differ from CI due to environment variance.

### Budget evolution

- Start with the simple assertions in `.lighthouserc.json`.
- Add a Lighthouse budgets file if/when we need resource- and route-specific budgets.

