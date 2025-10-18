# Spezifikation: Dynamische Kurs-Detailseite `/courses/[id]`

## Zweck

Stellt eine dynamische Seite bereit, die Kursdetails anhand der ID aus der Datenbank anzeigt.

## Anforderungen

- Route: `/courses/[id]` (Next.js App Router)
- Datenquelle: Prisma-Modell `Course`
- Anzeige: Kursname, Beschreibung, ggf. weitere Felder
- Fehlerhandling: 404 bei ungültiger ID
- UI: Material-UI Card
- E2E-Test: Routing und Anzeige validieren

## Akzeptanzkriterien

- Gültige ID zeigt Kursdetails
- Ungültige ID zeigt Fehlerseite
- E2E-Test besteht
- Quality Gates: Lint, Typecheck, Build, Test
