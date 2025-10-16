# Feature Specification: Access Segmentation Middleware

**Feature Branch**: `005-access-segmentation-middleware`  
**Created**: 2025-10-01  
**Status**: Draft  
**Input**: Define non-public route segments and required behaviors (auth, noindex)

## User Scenarios & Testing (mandatory)

### Primary User Story

As a signed-out user, when I navigate to non-public routes, I am redirected to sign-in; as a
signed-in user, I can access them and they are not indexed by search engines.

### Acceptance Scenarios

1. Given a non-public route, when an unauthenticated user requests it, then the user is redirected
   to sign-in.
2. Given a non-public route, when a signed-in user requests it, then the response includes noindex
   headers/meta.
3. Given public routes, when a crawler requests them, then noindex is not present and crawl is
   allowed.

### Edge Cases

- API routes vs. pages handling, avoiding loops, preserving return URL after login.

## Requirements (mandatory)

### Functional Requirements

- FR-001: System MUST enforce server-side authorization for non-public routes.
- FR-002: System MUST set `noindex` on non-public responses.
- FR-003: System SHOULD centralize logic in `middleware.ts` and shared helpers.
- FR-004: Unauthenticated requests MUST be redirected to
  `/sign-in?redirect_url=<encoded original path>` and MUST avoid redirect loops (no redirect when
  already on auth/sign-in routes or public routes).
- FR-005: Admin area MUST enforce role check "admin" server-side (in admin pages/layouts);
  middleware MUST NOT perform role checks (auth gating + noindex only).
- FR-006: Unauthenticated handling MUST differ by kind: API routes return `401 Unauthorized` with
  JSON error body; Page requests are redirected (302) to `/sign-in?redirect_url=<encoded>`.
- FR-007: SEO noindex MUST be applied via hybrid mechanism: (a) set
  `X-Robots-Tag: noindex, nofollow` header on non-public responses AND (b) ensure
  `<meta name="robots" content="noindex,nofollow">` is rendered for non-public pages (App Router
  layouts/pages under protected patterns). API responses MUST only include the header.

## Clarifications

### Session 2025-10-15

- Q: Which routes should be considered non-public (auth required + noindex)? → A: C (Hybrid:
  `(protected)` segment + explicit prefixes like `/admin`)

Implications:

- Protected pattern policy: All routes under `(protected)` are non-public; additionally, explicit
  top-level prefixes (initially `/admin`) are treated as non-public.
- Update FR-002/FR-003 applicability to these patterns.

- Q: What should the redirect target including return URL look like? → A: B
  (`/sign-in?redirect_url=<encoded original path>`)

Implications:

- Redirect policy: Unauthenticated requests are redirected to `/sign-in?redirect_url=<encoded>`.
- Return URL preservation is required; avoid redirect loops on auth routes.

- Q: What authorization level applies to the admin area? → A: C (server-side guards only in admin
  pages/layout; no middleware role checks)

Implications:

- Middleware remains lightweight (auth/noindex only), with no role logic.
- Admin role enforcement happens in SSR context (e.g., `requireAdmin()` within the admin area).

- Q: How should non-public API routes respond to unauthenticated access? → A: D (API → 401 JSON,
  pages → 302 redirect)

Implications:

- API behavior: On unauthenticated access, respond with 401 and a concise JSON error body.
- Page behavior: On unauthenticated access, redirect (302) to `/sign-in?redirect_url=<encoded>`.

- Q: Which noindex mechanism do we prefer for non-public content? → A: C (Hybrid: HTTP header
  X-Robots-Tag + HTML meta robots)

Implications:

- Middleware/Response utilities MUST attach `X-Robots-Tag: noindex, nofollow` to protected
  responses.
- App Router layouts for protected segments MUST render
  `<meta name="robots" content="noindex,nofollow">`.
- APIs remain header-only; pages get both header and meta.

### Non-Functional Requirements

- NFR-001: Minimal latency overhead; no double auth checks where avoidable.
- NFR-002: Clear configuration of protected route patterns.

## Review & Acceptance Checklist

- [ ] Requirements are testable and unambiguous
- [ ] Scope aligned with Constitution Principle XI
