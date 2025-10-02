-- Partial unique index for email where NOT NULL
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON "User" (email) WHERE email IS NOT NULL;
