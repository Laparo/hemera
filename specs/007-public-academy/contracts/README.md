# Contracts – Public Academy (007)

This folder defines public-facing API contracts used by the Academy feature.

## Endpoints (MVP)

- GET /api/courses
  - Returns paginated list of published courses with derived availability and pricing.
- GET /api/courses/{id}
  - Returns details for a single published course including availability.

See `openapi.yaml` for full schema. Contract tests can be generated from this document.
