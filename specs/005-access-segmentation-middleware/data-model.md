# Data Model: Access Segmentation Middleware

Diese Datei beschreibt die zentralen Konzepte, Policies und Validierungsregeln, die die Middleware
benötigt. Ziel ist eine provider-agnostische, performante und sichere Zugriffskontrolle.

## Entities

### ProtectedRoutePolicy

- scope: "segment" | "prefix"
- value: string
- description: Definition geschützter Bereiche. Standard: `(protected)` Segment und Präfixe aus
  `PROTECTED_PREFIXES` (default ["/admin"]).

### RedirectPolicy

- signinUrl: string (aus `NEXT_PUBLIC_CLERK_SIGN_IN_URL`)
- redirectParam: string = "redirect_url"
- allowRelativeOnly: boolean = true
- fallbackPath: string = "/"

### SkipList

- patterns: string[]
- default: [ "/_next", "/favicon.ico", "/static", "/assets", "/api/health", "/auth", "/webhooks", ]

### EnforcementScope

- pages: boolean (unauthenticated → 302 redirect)
- apis: boolean (unauthenticated → 401 JSON)

## Validation Rules

- signinUrl muss absolute URL sein (https://…), aus Env. Fehler bei leer/invalid.
- redirect_url darf nur relative In-App-Pfade enthalten (beginnend mit "/", keine Protokolle/Hosts,
  keine "//").
- Fallback auf "/" bei invalider oder fehlender redirect_url.
- SkipList-Matches sind prefix-basiert und case-sensitive.
- Middleware wird global ausgeführt; Durchsetzung nur für definierte ProtectedRoutePolicies.

## Error Modes

- MissingEnv: `NEXT_PUBLIC_CLERK_SIGN_IN_URL` fehlt/invalid → Middleware nutzt konservatives
  Verhalten: redirect auf "/sign-in" ohne redirect_url; dokumentiert als RISK (nicht brechen).
- InvalidRedirectParam: redirect_url invalid → fallbackPath.
- API Unauthorized: 401 JSON `{ error: "unauthorized" }` ohne sensitive Details.

## Success Criteria

- Unauthentifizierte Page-Requests auf geschützte Bereiche werden korrekt zur Sign-in-URL mit
  `redirect_url` weitergeleitet.
- Unauthentifizierte API-Requests in geschützten Bereichen liefern 401 JSON gemäß Contract.
- Geschützte Seiten senden `X-Robots-Tag: noindex, nofollow`; Layout setzt
  `<meta name="robots" content="noindex,nofollow">`.

## Edge Cases

- redirect_url enthält vollständige URL (http/https): wird verworfen, Fallback "/".
- redirect_url ist "//evil.com": wird verworfen, Fallback "/".
- Anfrage mit Accept: application/json auf Page-Route → weiterhin Redirect (Page-Semantik), nicht
  JSON.
- API-Unterpfade wie `/api/health` bleiben öffentlich (SkipList).
