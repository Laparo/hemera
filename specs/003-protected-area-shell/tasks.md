# Tasks: 003-protected-area-shell

Branch: `003-protected-area-shell`  
Scope: Protected app shell (layout + navigation) for authenticated users, SSR on Node, MUI SSR styling.  
Note: Follow Constitution v1.7.0 (Non-Public = SSR Node + server-side auth + noindex per 005). Tests first (TDD).

## Pre-flight

- [ ] T000 Confirm integration with 005 (access segmentation) to avoid duplicate guards  
  Files: `specs/005-access-segmentation-middleware/plan.md`  
  Ensure: middleware handles unauth redirects; server-side auth check remains for defense-in-depth.
- [ ] T001 Re-affirm Node runtime requirement for protected routes  
  Files: `specs/003-protected-area-shell/plan.md`

## Tests first

- [ ] T010 E2E: unauthenticated user redirected from `/protected` [P]  
  Files: `tests/e2e/protected-shell-redirect.spec.ts`  
  Assert: visiting `/protected` when signed-out redirects to sign-in and preserves return URL.
- [ ] T011 E2E: authenticated user sees protected layout + navigation [P]  
  Files: `tests/e2e/protected-shell-layout.spec.ts`  
  Assert: status 200; layout present; navigation links visible; session-indicator present.
- [ ] T012 Unit: server-side auth guard helper [P]  
  Files: `tests/unit/auth-guard.spec.ts`  
  Assert: returns session for signed-in, throws/returns null for unauth; covers error path.
- [ ] T013 Unit: MUI SSR setup sanity (no FOUC snapshot) [P]  
  Files: `tests/unit/mui-ssr.spec.ts`  
  Assert: baseline markup contains expected classnames/structure; no duplicate style tags.

## Implementation (make tests pass)

- [ ] T020 Implement server-side auth helper  
  Files: `app/lib/auth.ts`  
  Provide a thin wrapper for `getServerSession` usable in server components.
- [ ] T021 Implement protected layout (SSR Node)  
  Files: `app/(protected)/layout.tsx`  
  Include MUI SSR providers (App Router cache provider), `CssBaseline`, navigation.
- [ ] T022 Implement protected index page  
  Files: `app/(protected)/page.tsx`  
  Server component; uses auth helper; renders starter content.
- [ ] T023 Enforce Node runtime on protected routes  
  Files: `app/(protected)/layout.tsx`, `app/(protected)/page.tsx`  
  Ensure runtime set to Node for Prisma/NextAuth compatibility.
- [ ] T024 Integrate noindex for protected pages (aligned with 005)  
  Files: `app/(protected)/layout.tsx` or `app/(protected)/page.tsx`  
  Ensure meta/headers indicate `noindex`; avoid duplication with middleware header logic.

## Quality gates & docs

- [ ] T030 Docs: Update plan/research to state Node runtime, SSR guard placement, and 005 integration  
  Files: `specs/003-protected-area-shell/plan.md`, `specs/003-protected-area-shell/research.md`
- [ ] T031 CI docs gates pass (markdown lint, spelling DE/EN, link check)

## Done criteria

- Unauth users are redirected away from `/protected`; auth users see shell layout and nav.  
- Protected routes run on Node with server-side auth and noindex aligned with 005.  
%- MUI SSR is set up correctly (no visible FOUC); tests green; docs gates green.
