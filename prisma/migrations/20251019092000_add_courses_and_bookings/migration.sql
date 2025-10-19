-- Create enum for Booking.paymentStatus
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PaymentStatus') THEN
    CREATE TYPE "PaymentStatus" AS ENUM ('PENDING','PAID','FAILED','CANCELLED','REFUNDED','CONFIRMED');
  END IF;
END
$$;

-- Create courses table (mapped from Prisma model Course via @@map("courses"))
CREATE TABLE IF NOT EXISTS "courses" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "slug" TEXT NOT NULL,
  "price" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "capacity" INTEGER,
  "date" TIMESTAMP(3),
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "endTime" TIMESTAMP(3),
  "startTime" TIMESTAMP(3),
  CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- Unique slug for courses
CREATE UNIQUE INDEX IF NOT EXISTS "courses_slug_key" ON "courses" ("slug");

-- Create bookings table (mapped from Prisma model Booking via @@map("bookings"))
CREATE TABLE IF NOT EXISTS "bookings" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "stripePaymentIntentId" TEXT,
  "stripeSessionId" TEXT,
  "amount" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- Unique constraint equivalent to @@unique([userId, courseId])
CREATE UNIQUE INDEX IF NOT EXISTS "bookings_userId_courseId_key" ON "bookings" ("userId", "courseId");

-- Foreign keys for bookings
ALTER TABLE "bookings"
  ADD CONSTRAINT "bookings_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "bookings"
  ADD CONSTRAINT "bookings_courseId_fkey"
  FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
