# Data Model (Phase 1)

## Entities

- User
  - id (string/cuid)
  - name (string, optional)
  - email (string, optional; may be null if provider doesn’t return)
  - emailVerified (datetime, optional)
  - image (string, optional)
- Account (OAuth link)
  - id (string)
  - userId (fk -> User)
  - provider (string) // email, google, apple, instagram
  - providerAccountId (string) // unique per provider
  - type, access_token, refresh_token, expires_at (optional fields)
  
Unique constraints:
- (provider, providerAccountId) unique
- email unique only when not null
- VerificationToken
  - identifier (string)
  - token (string)
  - expires (datetime)
  
Unique constraints:
- token unique

## Constraints

- No Session table (JWT stateless sessions).
- Email is nullable; enforce uniqueness only when email IS NOT NULL (partial unique index).
- Account unique key: composite (provider, providerAccountId).
- Account.userId references User.id with ON DELETE CASCADE (removes linked accounts when a user is deleted).
- VerificationToken.token unique; consider ON DELETE CASCADE on user deletion if identifier references a user email/identifier.
- Timestamps: prefer UTC for all datetime fields; avoid timezone drift.
- Database schema: use a dedicated Postgres schema `hemera` via connection string parameter `?schema=hemera` to avoid collisions with `public` and keep objects scoped per app.

## Conceptual Prisma sketch (illustrative)

```prisma
model User {
  id             String   @id @default(cuid())
  name           String?
  email          String?  @unique(map: "users_email_unique") // enforce via partial index in SQL
  emailVerified  DateTime?
  image          String?
  accounts       Account[]
}

model Account {
  id                 String  @id @default(cuid())
  userId             String
  provider           String
  providerAccountId  String
  type               String?
  access_token       String?
  refresh_token      String?
  expires_at         Int?
  user               User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
}
```

## Notes

- JWT sessions → no Session table initially.
- Provider without email must still link via (provider, providerAccountId).
- Consider partial unique index on email (email IS NOT NULL).
- Reference: see Research Appendix for the SQL snippet: [SQL partial unique index for email](./research.md#appendix-optional-sql-partial-unique-index-for-email).
- Prisma project context: an existing Prisma project named "Hemera" can be referenced later if Accelerate/Data Proxy is enabled; not required for MVP.

## Validation & Data Integrity Checks

- Provider values must be one of: `email`, `google`, `apple`, `instagram` (enum-level validation at app layer; persisted as string).
- `providerAccountId` must be non-empty, trimmed, and reasonably bounded (recommend max 255 chars); store as-is (no lowercasing) unless provider guarantees case-insensitivity.
- Email normalization: trim and lowercase before write; accept only simple RFC5322-compatible formats; tolerate missing email for some providers.
- Identifiers:
  - `User.id` uses collision-resistant IDs (e.g., cuid/uuid).
  - `VerificationToken.token` uses cryptographically secure randomness (base64url/hex) with suitable length.
- Indexes (in addition to uniques):
  - `Account.userId` (non-unique) to speed up lookups by user.
  - Optional: `Account.provider` for admin/reporting queries.
  - Optional: `VerificationToken.identifier` to speed up token validation by identifier.
- Referential integrity:
  - `Account.userId` → `User.id` with `ON DELETE CASCADE`.
  - Tokens are independent; clean up expired tokens periodically.
- Time handling: store all timestamps in UTC; apply conversion at the edges (UI/API) only.

## Prisma Schema Validation (Placeholder)

Planned checks (conceptual):
- Ensure composite unique on `(provider, providerAccountId)` exists.
- Enforce partial unique constraint on `User.email` via raw SQL migration.
- Verify `Account.userId` relation with `onDelete: Cascade`.
- Confirm `VerificationToken.token` is unique.
