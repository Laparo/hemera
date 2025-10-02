# Research: 005-access-segmentation-middleware

## Decisions

- Use middleware for central gatekeeping of non-public routes
- Preserve return URL on redirect
- Apply `noindex` via headers/meta for protected pages

## Rationale

- Centralization reduces duplication and risk of inconsistent checks
- `noindex` avoids leaking protected content to search engines

## Alternatives Considered

- Per-page guards only: rejected as error-prone
- Client-only checks: rejected due to security and SEO concerns
