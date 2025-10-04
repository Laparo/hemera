# Feature Specification: Public Area – Academy Information and Bookable Courses

**Feature Branch**: `007-public-academy`  
**Created**: 2025-10-01  
**Status**: Draft  
**Input**: User description: "In the public area of the website, information about the hemera
academy is listed. It includes courses that can be booked."

## Execution Flow (main)

```text
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines

- ✅ Focus on WHAT and WHY (public information, course list, booking initiation)
- ❌ No technical details (no framework/API naming)
- 👥 Written for business stakeholders

### Section Requirements

- Mandatory: User Scenarios & Testing, Requirements
- Optional: Key Entities (relevant here)
- Remove sections that do not apply

### For AI Generation

- Clearly mark ambiguities (see [NEEDS CLARIFICATION])
- Do not guess prices/payment methods/locations — mark them
- Provide testable, measurable criteria

---

## User Scenarios & Testing (mandatory)

### Primary User Story

As an interested visitor, I want to read information about the hemera academy on the public website
and view available courses so that I can choose a suitable course and start a booking.

### Acceptance Scenarios

1. Given I am on the public academy area, When I open the course overview, Then I see a list of
   current courses with title, short description, duration/scope, start date(s) or availability, and
   a clear call to action to book.
2. Given a course has multiple upcoming dates or variants, When I open the course, Then I see a
   details page with full description, learning objectives, target audience, prerequisites, and a
   booking CTA.
3. Given I click “Book now” for a course, When I am redirected to the booking, Then a clear booking
   process begins (at least selecting date/variant and starting the booking request).

### Edge Cases

- No courses available: An empty state message is shown with a next best alternative.
- Course sold out: Label “sold out” and no direct booking CTA; potentially a waitlist [NEEDS
  CLARIFICATION: Is a waitlist desired?]
- Multiple languages/regions: Content and currency/prices vary [NEEDS CLARIFICATION: Is localization
  required?]
- External booking flow: CTA leads to an external platform [NEEDS CLARIFICATION: Internal vs.
  external booking?]

---

## Requirements (mandatory)

### Functional Requirements

- FR-001: The system MUST provide a public academy information area (overview, mission,
  contact/FAQ).
- FR-002: The system MUST display a public course list including at least title, short description,
  duration/scope, and availability/start date(s).
- FR-003: The system MUST provide a course details view with full description, learning objectives,
  target audience, prerequisites, dates/variants, and a booking CTA.
- FR-004: The system MUST display an appropriate empty state when no courses are available or only
  sold-out courses exist.
- FR-005: The system MUST provide a booking CTA that initiates a booking process (internal or
  external flow).
- FR-006: The system MUST clearly indicate when a course is sold out and prevent booking
  accordingly.
- FR-007: The system SHOULD offer a selectable option (e.g., date selection) for courses with
  multiple dates/variants before starting the booking.
- FR-008: The system SHOULD provide search/filter options for the course list (e.g., category,
  level, date, location/online) [NEEDS CLARIFICATION: Which filters are prioritized?]
- FR-009: The system SHOULD cover basic SEO content for the academy and course pages (title, meta
  description, human-readable URLs, structured data) without technical specification.
- FR-010: The system MUST consider basic accessibility (readable labels, keyboard navigation,
  contrasts).
- FR-011: The system SHOULD clearly represent course availability (e.g., “seats available”, “few
  seats”, “sold out”); source of availability data [NEEDS CLARIFICATION].
- FR-012: The system SHOULD display prices if available, including currency and tax notice [NEEDS
  CLARIFICATION: Show prices publicly? Gross/Net?]

### Key Entities

- Academy info: headline, introduction, sections (e.g., mission, program, contact/FAQ).
- Course: title, short description, description, learning objectives, target audience,
  prerequisites, category/level, duration/scope, price [optional], availability/status, media
  (image), SEO texts.
- Course date/variant: start date(s)/times, onsite/online, capacity, availability status, language.
- Booking CTA: target type (internal/external), target URL or process start parameters.

---

## Review & Acceptance Checklist

### Content Quality

- [ ] No implementation details
- [x] Focus on user and business value
- [x] Understandable for non-technical stakeholders
- [x] Mandatory sections filled

### Requirement Completeness

- [ ] No [NEEDS CLARIFICATION] markers (currently present)
- [x] Testability/clarity largely ensured
- [x] Success criteria recognizable (e.g., visible list, detail, booking CTA)
- [x] Scope clearly bounded (public, discovery + booking start)
- [x] Dependencies/assumptions marked (pricing, availability, localization)

---

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [ ] Review checklist passed
