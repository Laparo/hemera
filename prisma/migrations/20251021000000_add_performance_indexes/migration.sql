-- Add performance indexes for Course table
-- These indexes will dramatically improve query performance

-- Index for published courses ordered by date (getFeaturedCourses, getNextUpcomingCourse)
CREATE INDEX IF NOT EXISTS "courses_published_date_idx" ON "courses" ("isPublished", "date") WHERE "isPublished" = true;

-- Index for published courses ordered by createdAt (getFeaturedCourses)
CREATE INDEX IF NOT EXISTS "courses_published_created_idx" ON "courses" ("isPublished", "createdAt") WHERE "isPublished" = true;

-- Index for slug lookups (getCourseBySlug)
CREATE INDEX IF NOT EXISTS "courses_slug_published_idx" ON "courses" ("slug", "isPublished");