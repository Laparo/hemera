# Hemera - Vercel Deployment Guide

## 🚀 Quick Deployment

### 1. Vercel CLI Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project to Vercel
vercel link
```

### 2. Environment Variables Setup

Add these environment variables in your Vercel dashboard:

#### Database (Vercel Postgres)

```env
POSTGRES_PRISMA_URL=postgresql://username:password@hostname:port/database?pgbouncer=true&connect_timeout=15
POSTGRES_URL_NON_POOLING=postgresql://username:password@hostname:port/database
```

#### Authentication (NextAuth.js)

```env
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://your-app.vercel.app
```

#### OAuth (GitHub)

```env
GITHUB_ID=your-github-app-client-id
GITHUB_SECRET=your-github-app-client-secret
```

### 3. Database Setup

#### Create Vercel Postgres Database

```bash
# In your Vercel dashboard, go to Storage → Create Database → Postgres
# Copy the connection strings to your environment variables
```

#### Run Database Migration

```bash
# Deploy migrations
npx prisma migrate deploy

# Seed the database (optional)
npx prisma db seed
```

### 4. GitHub OAuth App Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App with:
   - **Application name**: Hemera
   - **Homepage URL**: `https://your-app.vercel.app`
   - **Authorization callback URL**: `https://your-app.vercel.app/api/auth/callback/github`
3. Copy Client ID and Client Secret to Vercel environment variables

### 5. Deploy

```bash
# Deploy to production
vercel --prod

# Or push to main branch (if connected to Git)
git push origin main
```

## 🔧 Configuration Files

### vercel.json

Optimized for Next.js 14 with:

- Prisma integration
- Function memory/timeout configuration
- Regional deployment (Frankfurt)
- Clean URLs

### Build Process

- Automatic Prisma Client generation
- Next.js static generation
- Sitemap generation
- Environment variable validation

## 📊 Performance Optimizations

### ISR (Incremental Static Regeneration)

- Course pages: 24-hour revalidation
- Homepage: Static generation with fallback

### Database Connection

- Connection pooling via PgBouncer
- Optimized query patterns
- Connection timeout handling

### SEO Features

- Automatic sitemap generation
- Robot.txt optimization
- Meta tags and Open Graph
- Structured data (JSON-LD)

## 🚨 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `POSTGRES_PRISMA_URL` | Pooled database connection | ✅ |
| `POSTGRES_URL_NON_POOLING` | Direct database connection | ✅ |
| `NEXTAUTH_SECRET` | NextAuth.js encryption secret | ✅ |
| `NEXTAUTH_URL` | Canonical app URL | ✅ |
| `GITHUB_ID` | GitHub OAuth App Client ID | ✅ |
| `GITHUB_SECRET` | GitHub OAuth App Client Secret | ✅ |

## 🎯 Deployment Checklist

- [ ] Vercel project linked
- [ ] Environment variables configured
- [ ] Vercel Postgres database created
- [ ] Database migrations deployed
- [ ] GitHub OAuth App configured
- [ ] Build and deployment successful
- [ ] Authentication working
- [ ] Course pages loading
- [ ] SEO meta tags present
- [ ] Performance metrics verified

## 📱 Post-Deployment Verification

### Core Functionality

```bash
# Test homepage
curl -I https://your-app.vercel.app

# Test course API
curl https://your-app.vercel.app/api/courses

# Test sitemap
curl https://your-app.vercel.app/sitemap.xml
```

### Performance Testing

- Lighthouse audit (target: 90+ scores)
- Core Web Vitals monitoring
- Database query performance

### SEO Validation

- Meta tags validation
- Open Graph testing
- Structured data validation
- Sitemap accessibility

## 🔍 Troubleshooting

### Common Issues

#### Database Connection Issues

- Verify environment variables
- Check Vercel Postgres connection strings
- Ensure migrations are deployed

#### Authentication Issues

- Verify GitHub OAuth app configuration
- Check callback URLs
- Validate NEXTAUTH_SECRET

#### Build Failures

- Check Prisma schema syntax
- Verify all dependencies are installed
- Review build logs in Vercel dashboard

#### Performance Issues

- Monitor function execution time
- Review database query patterns
- Check ISR configuration

## 📈 Monitoring & Analytics

### Vercel Analytics

- Automatic performance monitoring
- Core Web Vitals tracking
- Real user metrics

### Custom Monitoring

- API endpoint performance
- Database query monitoring
- User authentication flows

---

**Ready for Production** ✅
All configurations optimized for scalable, performant deployment.
