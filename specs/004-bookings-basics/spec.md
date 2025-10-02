# Feature Specification: Bookings Basics

**Feature Branch**: `004-bookings-basics`  
**Created**: 2025-10-01  
**Status**: Draft  
**Input**: Define minimal booking capability for authenticated users (create and view own bookings)

## User Scenarios & Testing (mandatory)

### Primary User Story

As an authenticated user, I can create a booking for a course and view my bookings.

### Acceptance Scenarios

1. Given I am signed in, when I submit a valid booking, then the system records it and confirms success.
2. Given I am signed in, when I open my bookings, then I see an up-to-date list of my bookings.
3. Given I am signed out, when I access booking pages or actions, then I am redirected to sign in.

### Edge Cases

- Duplicate booking attempts → show clear feedback without double creation.
- Invalid course reference → booking is rejected with a friendly error.
- Transient failures (network/db) → show retriable feedback.

## Requirements (mandatory)

### Functional Requirements

- FR-001: System MUST allow an authenticated user to create a booking for a target course.
- FR-002: System MUST show an authenticated user a list of their own bookings.
- FR-003: System MUST prevent unauthenticated users from accessing booking pages or actions.
- FR-004: System SHOULD prevent duplicate identical bookings for the same user and course.

### Non-Functional Requirements

- NFR-001: Booking actions are available only in the non-public area; public SEO is unaffected.
- NFR-002: Clear, accessible feedback for success and error states.

### Key Entities

- Booking: Represents a user’s registration/booking for a course.
- Course: Publicly discoverable course (read-only in this scope).
- User: Authenticated user who performs the booking.

---

## Review & Acceptance Checklist

- [ ] No prohibited implementation details
- [ ] Requirements are testable and unambiguous
- [ ] Success criteria measurable (creation works; list up-to-date; unauth blocked)
- [ ] Scope clearly bounded (minimal bookings only)

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [ ] Ambiguities marked (if any)
- [ ] User scenarios validated
- [ ] Requirements finalized
- [ ] Entities identified
- [ ] Review checklist passed
