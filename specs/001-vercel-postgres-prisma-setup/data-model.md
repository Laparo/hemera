# Data Model

## Entities

- User
  - id (string/uuid)
  - name (string, optional)
  - email (string, unique)
  - emailVerified (datetime, optional)
  - image (string, optional)
- Account (OAuth link)
  - id (string)
  - userId (fk -> User)
  - provider (string)
  - providerAccountId (string)
  - type, access_token, refresh_token, expires_at (optional fields)
- Session (optional if DB sessions used)
  - id (string)
  - userId (fk -> User)
  - sessionToken (string, unique)
  - expires (datetime)
- VerificationToken
  - identifier (string)
  - token (string)
  - expires (datetime)

## Notes

- Matches NextAuth Prisma schema defaults
- Additional domain entities to be added per feature needs
