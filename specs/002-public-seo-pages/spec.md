# Feature Specification: Public SEO Pages

**Feature Branch**: `002-public-seo-pages`  
**Created**: 2025-10-01  
**Status**: Draft  
**Input**: Provide a brief description of the public pages scope and SEO goals

## Execution Flow (main)

```text
1. Parse user description from Input
2. Extract key concepts from description
3. Mark ambiguities as [NEEDS CLARIFICATION]
4. Define User Scenarios & Testing
5. Generate Functional Requirements (testable)
6. Identify Key Entities (if data involved)
7. Run Review Checklist
8. Return: SUCCESS (spec ready for planning)
```

---

## Quick Guidelines

- Focus on WHAT and WHY (business value), not HOW
- Keep scope limited to public, SEO-relevant content
- Non-public areas are explicitly out of scope here

## User Scenarios & Testing (mandatory)

### Primary User Story

As a visitor, I can discover the site via search engines and view public pages (e.g., landing and course list) with fast loading and rich previews.

### Acceptance Scenarios

1. Given public pages are deployed, when a crawler indexes them, then meta/OG and structured data are present and valid.
2. Given a user lands on a public page, when content is rendered, then it is served via SSG/ISR with a defined revalidate time.
3. Given the site structure, when robots and sitemap are requested, then they are served correctly and reflect public routes.

### Edge Cases

- Missing or sparse data for listings → display placeholder courses with "Bald verfügbar" status and consistent meta.
- Overly frequent revalidation causing rate limits → tuned revalidate values.

## Requirements (mandatory)

### Functional Requirements

- FR-001: System MUST provide a public landing page with SSG containing hero section, course overview, and registration area.
- FR-002: System MUST provide a public course list page with ISR and 24-hour revalidation.
- FR-003: System MUST include SEO meta, Open Graph, and structured data (JSON-LD) with Organization, WebPage, and Course schemas.
- FR-004: System MUST expose sitemap and robots for public pages.
- FR-005: System MUST avoid leaking non-public paths in sitemap/metadata.

### Non-Functional Requirements

- NFR-001: Lighthouse SEO score ≥ 90 for public pages.
- NFR-002: Core Web Vitals MUST meet: LCP < 2.5s, FID < 100ms, CLS < 0.1 for SSG/ISR pages.

### Key Entities

- Course: Basic course information retrieved via database queries through API routes for public display

## Clarifications

### Session 2025-10-04

- Q: Welche konkreten Inhalte soll die Landing Page anzeigen? → A: Hero-Sektion + Kursübersicht + Anmeldebereich
- Q: Welche ISR-Revalidierung-Zeit ist für die Kursliste angemessen? → A: 24 Stunden (minimal für selten ändernde Inhalte)
- Q: Welche Datenquelle soll für die Kursinformationen verwendet werden? → A: Database queries via API routes
- Q: Welche spezifischen Schema.org structured data Typen sollen implementiert werden? → A: + Course schema für Kurslisten
- Q: Welches Fallback-Verhalten soll bei fehlenden Kursdaten implementiert werden? → A: Placeholder-Kurse mit "Bald verfügbar"

---

## Review & Acceptance Checklist

- [ ] No prohibited implementation details
- [ ] Requirements are testable and unambiguous
- [ ] Success criteria measurable (SEO/CWV targets)
- [ ] Scope bounded to public, SEO-focused delivery

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [ ] Ambiguities marked (if any)
- [ ] User scenarios validated
- [ ] Requirements finalized
- [ ] Entities identified (if needed)
- [ ] Review checklist passed
