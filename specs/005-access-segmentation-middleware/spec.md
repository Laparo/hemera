# Feature Specification: Access Segmentation Middleware

**Feature Branch**: `005-access-segmentation-middleware`  
**Created**: 2025-10-01  
**Status**: Draft  
**Input**: Define non-public route segments and required behaviors (auth, noindex)

## User Scenarios & Testing (mandatory)

### Primary User Story

As a signed-out user, when I navigate to non-public routes, I am redirected to sign-in; as a signed-in user, I can access them and they are not indexed by search engines.

### Acceptance Scenarios

1. Given a non-public route, when an unauthenticated user requests it, then the user is redirected to sign-in.
2. Given a non-public route, when a signed-in user requests it, then the response includes noindex headers/meta.
3. Given public routes, when a crawler requests them, then noindex is not present and crawl is allowed.

### Edge Cases

- API routes vs. pages handling, avoiding loops, preserving return URL after login.

## Requirements (mandatory)

### Functional Requirements

- FR-001: System MUST enforce server-side authorization for non-public routes.
- FR-002: System MUST set `noindex` on non-public responses.
- FR-003: System SHOULD centralize logic in `middleware.ts` and shared helpers.

### Non-Functional Requirements

- NFR-001: Minimal latency overhead; no double auth checks where avoidable.
- NFR-002: Clear configuration of protected route patterns.

## Review & Acceptance Checklist

- [ ] Requirements are testable and unambiguous
- [ ] Scope aligned with Constitution Principle XI
