# Quickstart: 005 — Access Segmentation Middleware

Goal: Centrally secure non-public routes (auth redirect) and set search engine exclusion (noindex).

## Prerequisites

- Local environment: `.env.local` with valid Clerk keys and Next.js basics.
- Test user with Clerk role:
  - In the Clerk dashboard ([dashboard.clerk.com](https://dashboard.clerk.com)), set
    `publicMetadata.role = "admin"` for a user to test admin areas.

## Getting started

1. Start dev server

```bash
npm run dev
```

1. Manual verification (after implementation)

- Unauth → protected page:
  - For example, `/admin` or a route under `(protected)/*` should 302 to
    `/sign-in?redirect_url=<original>`.
- Auth → protected page:
  - After signing in, request the same route; response includes `X-Robots-Tag: noindex, nofollow`
    and the page renders `<meta name="robots" content="noindex,nofollow">`.
- API (non-public):
  - Unauth → `401` JSON; Auth (without admin) → `403` for admin endpoints.

1. E2E tests (once added)

```bash
npx playwright test tests/e2e/protected-redirect.spec.ts
npx playwright test tests/e2e/protected-noindex.spec.ts
```

## Set admin role (Clerk)

1. Open dashboard → Users → Select user → Metadata → Public metadata.
2. JSON:

```json
{ "role": "admin" }
```

1. Save, re-login if necessary.

## Troubleshooting

- No redirect? Check if the route matches protected patterns (`(protected)` or explicit prefixes
  like `/admin`).
- No `X-Robots-Tag`? Verify middleware/helper is active and the page is not marked public.
- API returns 302 instead of 401? Ensure middleware differentiates API vs. page (FR-006).
