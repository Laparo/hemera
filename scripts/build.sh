#!/bin/bash
# Build script for Vercel deployment

set -euo pipefail

echo "🚀 Starting Vercel build process..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm ci

# 2. Generate Prisma Client (for build-time type generation)
echo "🔧 Generating Prisma Client..."
npx prisma generate

# 3. Build the Next.js application
echo "🏗️ Building Next.js application..."
npm run build

# 4. Generate sitemap (if needed)
echo "🗺️ Generating sitemap..."
npx next-sitemap

echo "✅ Build completed successfully!"