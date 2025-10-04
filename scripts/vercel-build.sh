#!/bin/bash
# Vercel Pre-deployment script
# This script runs before the build process on Vercel

echo "🔧 Pre-deployment setup starting..."

# Check if we're in Vercel environment
if [ "$VERCEL" = "1" ]; then
  echo "✅ Running in Vercel environment"
  
  # Generate Prisma Client
  echo "🔄 Generating Prisma Client..."
  npx prisma generate
  
  # Run database migrations (only if POSTGRES_PRISMA_URL is set)
  if [ -n "$POSTGRES_PRISMA_URL" ]; then
    echo "🗃️ Running database migrations..."
    npx prisma migrate deploy --schema=./prisma/schema.prisma
  else
    echo "⚠️ Skipping database migrations - POSTGRES_PRISMA_URL not set"
  fi
  
else
  echo "🏠 Running in local environment"
fi

echo "✅ Pre-deployment setup completed!"