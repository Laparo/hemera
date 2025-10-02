# Database setup options

Für Hemera benötigst du eine PostgreSQL‑Datenbank. Wähle eine der folgenden Optionen.

## Option A — Neon (empfohlen für Previews)

1. Projekt anlegen: [Neon](https://neon.tech) → neues Project → Database + Role werden erzeugt.
1. Connection Details öffnen → "Pooled" (Serverless Pooler) auswählen.
1. Verbindungs‑URL kopieren und den Schema‑Parameter ergänzen:
   - `?sslmode=require&schema=hemera`
1. In `.env.local` setzen:

```bash
DATABASE_URL=postgres://USER:PASS@ep-xxxx-pooler.eu-central-1.aws.neon.tech/DBNAME?sslmode=require&schema=hemera
```

1. Migration + Seed lokal ausführen:

```bash
npx prisma migrate dev --name init
node prisma/seed.ts
```

Hinweis: Für Vercel solltest du ebenfalls die gepoolte DSN nutzen.

## Option B — Vercel Postgres (falls verfügbar)

1. Vercel Dashboard → Project → Storage → Postgres hinzufügen.
1. Unter "Connect" die Connection Pooling URL wählen (nicht die direkte).
1. In Project → Settings → Environment Variables `DATABASE_URL` setzen.
1. Lokal die Env synchronisieren (optional):

```bash
vercel env pull .env.local
```

1. Migration + Seed lokal ausführen:

```bash
npx prisma migrate dev --name init
node prisma/seed.ts
```

## Option C — Lokal per Docker

1. Postgres starten (Docker):

```bash
docker run --name hemera-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=hemera -p 5432:5432 -d postgres:16
```

1. `.env.local` setzen:

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5432/hemera?schema=hemera
```

1. Migration + Seed:

```bash
npx prisma migrate dev --name init
node prisma/seed.ts
```

## Wo wird `DATABASE_URL` genutzt?

- `prisma/schema.prisma` → `datasource db` liest `env("DATABASE_URL")`.
- Prisma Migrations und Seed verwenden dieselbe URL.

## Troubleshooting

- SSL Fehler: Setze `sslmode=require` (Neon/Vercel) in der URL.
- Schema fehlt: Ergänze `schema=hemera` in der Query.
- Verbindungsfehler lokal: Prüfe Docker‑Container läuft (`docker ps`) und Port 5432 ist frei.
- Prisma schema validation / get-config (wasm): Stelle sicher, dass die richtige `.env` geladen ist. Verwende die npm‑Skripte:
   - `npm run db:status`
   - `npm run db:migrate`
   - `npm run db:deploy`
   - `npm run db:seed`

## Preview‑Datenbanken pro PR

- GitHub Actions Workflow: `.github/workflows/preview-db.yml`
- Erfordert GitHub Secret `PREVIEW_DATABASE_URL` (gepoolte Postgres‑DSN)
- Provisionierung: `scripts/preview/provision-db.js` erstellt ein Schema `hemera_pr_<PR>`, führt Migrationen und Seed aus.
- Teardown: `scripts/preview/teardown-db.js` löscht das Schema beim Schließen der PR.
