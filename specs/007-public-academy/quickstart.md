# Quickstart – Public Academy (007)

Spec: /Users/Zauberflocke/Documents/GitHub/hemera/specs/007-public-academy/spec.md

## Prerequisites

- Node 22.x
- Database URL configured (Vercel Postgres or local Postgres)

## Start (local)

1. Install deps
2. DB provision + seed
3. Dev server starten

```bash
npm ci

# optional: provision (repo-scripts)
node scripts/preview/provision-db.js

# Prisma setup (if needed)
npx prisma migrate deploy
node prisma/seed.ts

npm run dev
```

## Kursliste & Detail testen

- Liste: <http://localhost:3000/courses>
- Detail: <http://localhost:3000/courses/{id}>
- „Ausgebucht“ wird angezeigt, wenn availableSpots = 0

## E2E Tests (optional)

```bash
# Alle E2E-Tests
npx playwright test tests/e2e

# Nur Ausgebucht-Checks
npx playwright test tests/e2e/courses-soldout.spec.ts
npx playwright test tests/e2e/course-detail-soldout.spec.ts
```

## Notes

- Single-locale (DE/EUR); Preise brutto.
- Interner Buchungsflow: `/bookings/new?courseId=...` (Anmeldung erforderlich).
