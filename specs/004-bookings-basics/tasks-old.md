# Tasks: 004-bookings-basics

Branch: `004-bookings-basics`  
Scope: Complete booking and payment system with Stripe integration; Node SSR; Prisma with payment
tracking.  
Note: Tests first; respect Node runtime for Prisma/NextAuth; secure payment handling.

## Pre-flight

- [ ] T000 Constitution check reaffirmed (Non-Public SSR Node, noindex)  
       Files: `/.specify/memory/constitution.md`, `specs/004-bookings-basics/plan.md`

## Tests first (Core Booking)

- [ ] T001 Unit: Course model validations [P]  
       Files: `tests/unit/course-model.spec.ts`  
       Assert: required fields; price validation; capacity constraints.
- [ ] T002 Unit: Booking model validations [P]  
       Files: `tests/unit/booking-model.spec.ts`  
       Assert: unique constraint logic; payment status validation; required fields.
- [ ] T003 E2E: Create booking (happy path)  
       Files: `tests/e2e/booking-create.spec.ts`  
       Assert: signed-in user can create booking; success feedback shown.
- [ ] T004 E2E: List user bookings  
       Files: `tests/e2e/booking-list.spec.ts`  
       Assert: signed-in user sees their bookings; payment status displayed.

## Tests first (Stripe Payment)

- [ ] T005 E2E: Complete payment flow  
       Files: `tests/e2e/payment-complete.spec.ts`  
       Assert: booking → Stripe Checkout → payment confirmation → booking confirmed.
- [ ] T006 E2E: Handle payment failure  
       Files: `tests/e2e/payment-failure.spec.ts`  
       Assert: failed payment → booking remains pending → user can retry.
- [ ] T007 Unit: Stripe webhook processing  
       Files: `tests/unit/stripe-webhook.spec.ts`  
       Assert: webhook verification; booking status updates; idempotency.

## Implementation Phase 1: Core Models

- [ ] T010 Prisma: add Course model + migration  
       Files: `prisma/schema.prisma`, `prisma/migrations/*`  
       Include: title, description, price, capacity, date fields.
- [ ] T011 Prisma: add Booking model + migration  
       Files: `prisma/schema.prisma`, `prisma/migrations/*`  
       Include: course relation, user, payment status, stripe session ID.
- [ ] T012 Seed: Create sample courses  
       Files: `prisma/seed.ts`  
       Sample courses with different prices and dates.

## Implementation Phase 2: Stripe Setup

- [ ] T020 Environment: Stripe configuration  
       Files: `.env.local`, `lib/stripe.ts`  
       Setup: Stripe publishable/secret keys; webhook endpoint secret.
- [ ] T021 API: Stripe checkout session creation  
       Files: `app/api/stripe/checkout/route.ts`  
       Create Stripe Checkout session for course booking.
- [ ] T022 API: Stripe webhook handler  
       Files: `app/api/stripe/webhook/route.ts`  
       Handle: payment_intent.succeeded, checkout.session.completed.

## Implementation Phase 3: Booking Flow

- [ ] T030 UI: Course listing page  
       Files: `app/(protected)/courses/page.tsx`  
       Display available courses; "Book Now" buttons.
- [ ] T031 UI: Booking creation with Stripe  
       Files: `app/(protected)/courses/[id]/book/page.tsx`  
       Course details; booking form; redirect to Stripe Checkout.
- [ ] T032 UI: Payment success/cancel pages  
       Files: `app/(protected)/payment/success/page.tsx`,
      `app/(protected)/payment/cancel/page.tsx`  
       Handle Stripe redirect; show booking confirmation or retry option.
- [ ] T033 UI: User bookings dashboard  
       Files: `app/(protected)/bookings/page.tsx`  
       List user bookings; show payment status; course details.

## Implementation Phase 4: Security & Error Handling

- [ ] T040 Server: Input validation and sanitization  
       Files: `lib/validation.ts`, booking API routes  
       Validate: course ID, user authentication, booking constraints.
- [ ] T041 Server: Error handling and logging  
       Files: Booking and payment API routes  
       Handle: Stripe errors, booking conflicts, payment failures.
- [ ] T042 Security: Rate limiting for payment endpoints  
       Files: `middleware.ts` or API routes  
       Prevent: payment spam, booking manipulation.

## Quality gates & docs

- [ ] T050 Docs: Update plan/research with payment flows  
       Files: `specs/004-bookings-basics/plan.md`, `specs/004-bookings-basics/research.md`
- [ ] T051 Docs: Stripe integration documentation  
       Files: `docs/ops/stripe-integration.md`  
       Document: setup, testing, webhook handling, troubleshooting.
- [ ] T052 CI docs gates pass (markdown lint, spelling DE/EN, link check)

## Done criteria

- Complete booking and payment system functional end-to-end for signed-in users.
- Stripe Checkout integration working with payment confirmation.
- Course catalog available; users can book and pay for courses.
- Booking status tracking (pending, confirmed, failed, cancelled).
- Webhook handling for secure payment processing.
- Error handling for payment failures and booking conflicts.
- Unauth users cannot access booking/payment features.
- Prisma migrations clean; all tests green; docs gates green.
- Stripe integration documented and testable in development.
