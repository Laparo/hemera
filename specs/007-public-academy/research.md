# Research – Public Academy (007)

Date: 2025-10-23 Branch: 007-public-academy Spec:
/Users/Zauberflocke/Documents/GitHub/hemera/specs/007-public-academy/spec.md

## Decisions

- Booking flow: Internal booking frontend (CTA → /bookings/new?courseId=...)
  - Rationale: Consistent with internal inventory and current auth/session model
  - Alternatives: External checkout (Stripe Checkout) – rejected for MVP scope
- Pricing model: Public gross prices (incl. VAT), locale DE/EUR
  - Rationale: Business clarity, single-locale MVP keeps complexity low
  - Alternatives: Net + VAT breakdown or multi-locale – deferred
- Availability: Derived from internal bookings (PAID|PENDING) vs. capacity
  - Rationale: Aligns with internal inventory; avoids race conditions
  - Alternatives: Separate inventory service – premature for MVP
- SEO/Schema: Use JSON-LD Course schema on list and detail
  - Rationale: Improves discoverability; aligns with FR-009

## Open Questions (resolved or deferred)

- Waitlist support: Deferred (explicitly out of scope)
- Filters/search: Deferred (explicitly out of scope)

## Implementation Notes

- Entities (from Prisma): Course, Booking, PaymentStatus
- Availability formula: availableSpots = max(0, capacity - count(booking in [PAID,PENDING]))
- Accessibility: Ensure CTA disabled semantics and assistive text for sold-out

## Risks

- Data freshness in SSR vs. client fetch on detail – use dynamic rendering for list as needed
- Auth-protected previews: E2E must tolerate 401/redirects in preview/prod

## Progress Tracking

- [x] Research complete
- [x] Unknowns resolved for MVP scope
