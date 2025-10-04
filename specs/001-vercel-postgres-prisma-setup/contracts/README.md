# Contracts

This setup feature does not introduce public business APIs. Contracts are limited to auth flows.

- OAuth callback endpoints (NextAuth route handler)
- Protected page requires authenticated session

Contract tests are represented as integration tests for auth and protected routes, rather than
OpenAPI/GraphQL specs.
