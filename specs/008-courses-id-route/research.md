# Research: Dynamische Kurs-Detailseite `/courses/[id]`

## Next.js Dynamic Routing

- Verwendung von `[id]` im App Router für dynamische Seiten.
- `page.tsx` kann mit `params` auf die ID zugreifen.

## Prisma Integration

- Datenmodell `Course` prüfen: Felder wie `id`, `name`, `description`.
- Datenbankabfrage mit Prisma Client im Server-Component.

## Fehlerhandling

- 404-Seite bei ungültiger ID.
- Next.js: `notFound()` verwenden.

## UI

- Material-UI Card für ansprechende Darstellung.

## Test

- Playwright E2E-Test für Routing und Anzeige.
