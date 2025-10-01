# Research: 003-protected-area-shell

## Decisions

- SSR on Node for all protected routes
- Server-side session check via NextAuth helper
- MUI SSR setup with App Router cache provider and CssBaseline

## Rationale

- Prevent client-only flicker and ensure secure access gating
- Provide consistent styling and avoid hydration issues

## Alternatives Considered

- CSR-only protected area: rejected due to security and UX
- Edge runtime with Prisma/NextAuth: rejected (Prisma not supported on Edge)
