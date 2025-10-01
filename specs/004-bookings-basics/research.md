# Research: 004-bookings-basics

## Decisions

- Prisma model: `Booking` with `id`, `userId`, `courseId`, timestamps
- Unique constraint: `(userId, courseId)` to avoid duplicates
- Server actions or route handlers for create/list (Node runtime)

## Rationale

- Minimal surface to validate the domain and technical path end-to-end
- Duplicate prevention improves UX and data quality

## Alternatives Considered

- Client-only submission: rejected due to security and SSR model
- Allow duplicates and deduplicate later: rejected for initial scope
