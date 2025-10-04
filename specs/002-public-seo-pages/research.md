# Research: Public SEO Pages

## Next.js SEO Best Practices

### Decision: App Router with SSG/ISR Strategy
**Rationale**: 
- App Router provides better SEO defaults and metadata API
- SSG for static landing page ensures fast TTFB and optimal SEO
- ISR for course list balances data freshness with performance
- 24-hour revalidation minimizes costs while maintaining reasonable freshness

**Alternatives considered**:
- Pages Router: Less modern, worse SEO defaults
- Pure SSR: Higher server costs, slower initial loads
- CSR: Poor SEO, slower content indexing

### Decision: Schema.org Implementation Strategy
**Rationale**:
- Organization schema establishes site authority
- WebPage schema provides basic page context
- Course schema enables rich snippets for educational content
- JSON-LD format preferred by Google over microdata

**Alternatives considered**:
- Microdata: More verbose, harder to maintain
- RDFa: Complex syntax, less tooling support
- No structured data: Missed SEO opportunities

### Decision: Database Integration via API Routes
**Rationale**:
- Leverages existing Prisma setup from Feature 001
- API routes enable ISR revalidation hooks
- Maintains separation of concerns
- Scalable for future features

**Alternatives considered**:
- Direct database queries in components: Couples data layer
- External CMS: Additional complexity and costs
- Static JSON files: Not scalable, no dynamic updates

### Decision: Material-UI for Consistent Design
**Rationale**:
- Already established in project dependencies
- Good accessibility defaults (WCAG 2.1 AA)
- SEO-friendly semantic HTML output
- Consistent with existing design system

**Alternatives considered**:
- Tailwind CSS: Would require additional setup
- Custom CSS: More development time, less consistency
- Other UI libraries: Breaking change from existing setup

### Decision: Playwright + Lighthouse CI for Testing
**Rationale**:
- Playwright already configured for E2E testing
- Lighthouse CI provides automated SEO scoring
- Integrates well with Vercel deployment pipeline
- Validates both functionality and performance

**Alternatives considered**:
- Jest + Testing Library only: No SEO validation
- Manual testing: Not scalable, error-prone
- Other E2E tools: Would require reconfiguration

## Performance Considerations

### SSG Landing Page Strategy
- Pre-generated at build time for optimal performance
- Cached by CDN indefinitely until next deployment
- Hero section, course overview, and registration area statically rendered

### ISR Course List Strategy  
- Initial static generation with 24-hour revalidation
- Stale-while-revalidate for seamless user experience
- Fallback to placeholder courses during data issues

### SEO Metadata Optimization
- Dynamic metadata generation based on page content
- Optimized image sizes and formats for OG images
- Localized meta descriptions and titles

## Integration Points

### Existing Prisma Schema Extension
- Course model addition to existing database schema
- Minimal impact on authentication system from Feature 001
- Reuse of existing database connection and migration setup

### Vercel Deployment Considerations
- ISR configuration for edge caching
- Environment variables for database connection
- Build-time sitemap generation for optimal indexing
