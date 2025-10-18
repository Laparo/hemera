# Plan: Courses [id]-Route

## Ziel

Implementiere eine dynamische Next.js-Route `/courses/[id]`, die Kursdetails aus der Datenbank
rendert.

## Schritte

1. Datenmodell prüfen (Prisma: Course).
2. Neue Datei: `app/courses/[id]/page.tsx` mit dynamischem Fetch.
3. E2E-Test: `tests/e2e/courses-id.spec.ts` prüft Routing und Anzeige.
4. API-Absicherung: Fehlerhandling für ungültige IDs.
5. UI: Material-UI Card für Kursdetails.

## Quality Gates

- TypeScript, ESLint, Prettier, E2E-Test, Build.

## Constitution Check

- Test-First, Error Handling, Auth (falls protected), Quality Gates.
