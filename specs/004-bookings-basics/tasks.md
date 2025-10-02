# Tasks: 004-bookings-basics

Branch: `004-bookings-basics`  
Scope: Minimal bookings (create + list) in protected area; Node SSR; Prisma with unique constraint.  
Note: Tests first; respect Node runtime for Prisma/NextAuth.

## Pre-flight

- [ ] T000 Constitution check reaffirmed (Non-Public SSR Node, noindex)  
  Files: `/.specify/memory/constitution.md`, `specs/004-bookings-basics/plan.md`

## Tests first

- [ ] T001 Unit: Booking model validations [P]  
  Files: `tests/unit/booking-model.spec.ts`  
  Assert: unique constraint logic; required fields.
- [ ] T002 E2E: Create booking (happy path)  
  Files: `tests/e2e/booking-create.spec.ts`  
  Assert: signed-in user can create booking; success feedback shown.
- [ ] T003 E2E: List user bookings  
  Files: `tests/e2e/booking-list.spec.ts`  
  Assert: signed-in user sees their bookings; unauth redirected.

## Implementation (make tests pass)

- [ ] T010 Prisma: add Booking model + migration  
  Files: `prisma/schema.prisma`, `prisma/migrations/*`
- [ ] T011 Server: create booking action/route  
  Files: `app/(protected)/bookings/new/page.tsx`, `app/api/bookings/route.ts` or server action  
  Ensure Node runtime; input validation; error handling.
- [ ] T012 Server: list bookings for user  
  Files: `app/(protected)/bookings/page.tsx`  
  SSR; server-side session; query by `userId`.
- [ ] T013 UI: MUI forms and feedback (success/error) [P]  
  Files: `app/(protected)/bookings/new/page.tsx`

## Quality gates & docs

- [ ] T020 Docs: Update plan/research with final model and flows  
  Files: `specs/004-bookings-basics/plan.md`, `specs/004-bookings-basics/research.md`
- [ ] T021 CI docs gates pass (markdown lint, spelling DE/EN, link check)

## Done criteria

- Booking create/list works end-to-end for signed-in users.  
- Unauth users cannot access booking features.  
- Prisma migrations clean; tests green; docs gates green.
