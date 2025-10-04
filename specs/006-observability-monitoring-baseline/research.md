# Research: 006-observability-monitoring-baseline

## Integration Approaches

- Sentry for Next.js provides server and client integrations; can be initialized via
  `sentry.client.config.ts` and `sentry.server.config.ts` in the app root. App Router support is
  available.
- Request ID: Generate UUID v4 in middleware when header missing; propagate via request headers to
  route handlers and expose in `headers()` for server components.

## Alternatives

- OpenTelemetry + vendor exporter (App Insights, Datadog): more powerful tracing but heavier setup;
  defer to later feature.
- Log to Vercel’s function logs only: simplest, but lacks structure/correlation; poor portability.
- Next-Analytics-only: covers Web Vitals but not errors/exceptions.

## Privacy & Compliance

- Do not log PII by default; redact suspected PII keys (email, name) if inadvertently passed.
- Only attach user identifiers to telemetry if explicit consent exists (future work); default OFF.
- Respect robots/noindex rules for private areas; telemetry must not affect public SEO.

## Open Questions

- Sampling defaults for production (e.g., tracesSampleRate 0.05) to be confirmed later.
- Whether to add a consent banner hook tying into telemetry (future feature).
