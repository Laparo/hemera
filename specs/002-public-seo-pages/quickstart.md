# Quickstart: Public SEO Pages

## Overview

This quickstart guide validates the successful implementation of public SEO pages with optimized search engine visibility and performance.

## Prerequisites

- Next.js app running with App Router
- Prisma database connection established
- Course data seeded in database
- Vercel deployment or local development server

## Verification Steps

### 1. Landing Page Functionality

**Navigate to landing page:**
```bash
curl -I https://hemera.example.com/
# or visit in browser: http://localhost:3000/
```

**Expected results:**
- ✅ Page loads with status 200
- ✅ Hero section displays prominently
- ✅ Course overview shows available courses
- ✅ Registration area with clear CTA
- ✅ Page served as SSG (instant load, no loading states)

### 2. Course List Page Functionality

**Navigate to course list:**
```bash
curl -I https://hemera.example.com/courses
# or visit in browser: http://localhost:3000/courses
```

**Expected results:**
- ✅ Page loads with status 200
- ✅ Displays list of published courses
- ✅ Course cards show title, description, level, duration
- ✅ Fallback "Bald verfügbar" courses if no data
- ✅ Page served with ISR (fast load, may show stale data)

### 3. SEO Meta Tags Validation

**Check landing page meta tags:**
```bash
curl -s https://hemera.example.com/ | grep -E '<title>|<meta.*description|<meta.*og:'
```

**Expected output includes:**
```html
<title>Hemera - Moderne Kurse für Entwickler</title>
<meta name="description" content="Entdecken Sie unsere Kurse..." />
<meta property="og:title" content="Hemera - Moderne Kurse für Entwickler" />
<meta property="og:description" content="Entdecken Sie unsere Kurse..." />
<meta property="og:image" content="https://hemera.example.com/og-image.jpg" />
```

### 4. Structured Data Validation

**Check for JSON-LD structured data:**
```bash
curl -s https://hemera.example.com/ | grep -A 20 'application/ld+json'
```

**Expected schemas:**
- ✅ Organization schema with name, URL, logo
- ✅ WebPage schema with page details
- ✅ Course schemas for course list page

**Validate with Google's Rich Results Test:**
- Visit: https://search.google.com/test/rich-results
- Enter page URL: https://hemera.example.com/courses
- ✅ Course structured data detected and valid

### 5. Sitemap and Robots Validation

**Check sitemap accessibility:**
```bash
curl -I https://hemera.example.com/sitemap.xml
```
- ✅ Returns 200 status
- ✅ Content-Type: application/xml

**Check robots.txt:**
```bash
curl https://hemera.example.com/robots.txt
```
**Expected content:**
```
User-agent: *
Allow: /
Allow: /courses

Sitemap: https://hemera.example.com/sitemap.xml
```

### 6. Performance Validation

**Lighthouse SEO score check:**
```bash
npx lighthouse https://hemera.example.com/ --only-categories=seo --output=json
```
- ✅ SEO score ≥ 90
- ✅ Meta description present
- ✅ Page has H1 heading
- ✅ Links have descriptive text

**Core Web Vitals (manual check in DevTools):**
- ✅ LCP < 2.5s (SSG should be instant)
- ✅ FID < 100ms
- ✅ CLS < 0.1

### 7. API Contract Validation

**Test courses API endpoint:**
```bash
curl -H "Accept: application/json" https://hemera.example.com/api/courses
```

**Expected response format:**
```json
{
  "courses": [
    {
      "id": "clx1234567890",
      "title": "Einführung in Next.js",
      "description": "Lernen Sie die Grundlagen...",
      "slug": "einfuehrung-nextjs",
      "level": "Beginner",
      "duration": "4 Wochen"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "pageSize": 12
  }
}
```

### 8. Database Integration Check

**Verify course data in database:**
```bash
# If using Prisma Studio
npx prisma studio
```
- ✅ Course model exists with correct schema
- ✅ Sample courses have `isPublic: true`
- ✅ Published courses appear in API response

### 9. ISR Revalidation Test

**Test 24-hour revalidation (manual):**
1. Note timestamp of course list page
2. Update course data in database
3. Wait or force revalidation
4. ✅ Changes appear within 24 hours
5. ✅ Old version served during revalidation

### 10. Mobile and Accessibility Check

**Mobile responsiveness:**
- ✅ Pages render correctly on mobile devices
- ✅ Touch targets are appropriate size
- ✅ Text is readable without zooming

**Basic accessibility:**
- ✅ Pages work with keyboard navigation
- ✅ Images have alt attributes
- ✅ Color contrast meets WCAG guidelines

## Troubleshooting

### Common Issues

**Courses not appearing:**
- Check `isPublic: true` in database
- Verify `status: PUBLISHED` for courses
- Check API endpoint returns data

**SEO meta tags missing:**
- Verify Next.js metadata API implementation
- Check for proper head exports
- Validate component hierarchy

**Lighthouse SEO score < 90:**
- Ensure all images have alt attributes
- Check meta description length (150-160 chars)
- Verify heading structure (H1 → H2 → H3)
- Add missing structured data

**ISR not working:**
- Check revalidate configuration in page
- Verify API routes are properly configured
- Check Vercel deployment settings

## Success Criteria

This quickstart is successful when:
- [ ] Landing page loads with SSG performance
- [ ] Course list displays with ISR functionality
- [ ] SEO meta tags present and valid
- [ ] Structured data passes Google validation
- [ ] Sitemap and robots.txt accessible
- [ ] Lighthouse SEO score ≥ 90
- [ ] API contracts return expected data format
- [ ] Database integration works correctly
- [ ] ISR revalidation functions as expected
- [ ] Mobile and accessibility requirements met

## Next Steps

After successful validation:
1. Set up monitoring for SEO scores
2. Configure Google Search Console
3. Monitor Core Web Vitals in production
4. Plan content strategy for courses
5. Consider implementing course detail pages (future feature)