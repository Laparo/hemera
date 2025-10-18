# Quickstart: `/courses/[id]` Route

1. Prüfe das Prisma-Modell `Course` in `prisma/schema.prisma`.
2. Erstelle die Datei `app/courses/[id]/page.tsx`.
3. Hole Kursdaten per Prisma und zeige sie in einer Material-UI Card.
4. Implementiere Fehlerhandling für ungültige IDs (`notFound()`).
5. Schreibe einen Playwright E2E-Test: `tests/e2e/courses-id.spec.ts`.
6. Prüfe Quality Gates: Lint, Typecheck, Build, Test.
