-- This migration intentionally does nothing.
-- Context: The preceding migration `20251019092000_add_courses_and_bookings` already created
-- the PaymentStatus enum, the "courses" and "bookings" tables, their indexes, and FKs.
-- This file previously duplicated those DDL statements and caused failures when applied
-- to a database that had already run the earlier migration.
--
-- Converting this migration to a no-op ensures a consistent, linear history without
-- re-creating objects or requiring destructive operations in CI/preview pipelines.

DO $$
BEGIN
    RAISE NOTICE 'No-op migration: objects already created in 20251019092000_add_courses_and_bookings.';
END $$;
