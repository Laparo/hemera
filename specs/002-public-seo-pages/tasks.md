# Tasks: Public SEO Pages

**Input**: Design documents from `/specs/002-public-seo-pages/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)

```text
1. Load plan.md from feature directory ✓
   → Extract: TypeScript 5.x + Node.js 18+, Next.js 14 (App Router), React 18, Prisma Client, @mui/material
   → Structure: Next.js App Router with dedicated SEO components and API routes
2. Load optional design documents ✓:
   → data-model.md: Course entity with PostgreSQL schema ✓
   → contracts/: API endpoints for /courses and /sitemap ✓
   → research.md: SSG/ISR strategy, Schema.org decisions ✓
3. Generate tasks by category ✓:
   → Setup: Prisma schema, dependencies, TypeScript
   → Tests: contract tests, integration tests, SEO tests
   → Core: Course model, API routes, SEO components
   → Integration: Database, ISR configuration, sitemap
   → Polish: performance tests, accessibility, documentation
4. Apply task rules ✓:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...) ✓
6. Generate dependency graph ✓
7. Create parallel execution examples ✓
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

Next.js App Router structure with repository root:

- **Pages**: `app/page.tsx`, `app/courses/page.tsx`
- **API Routes**: `app/api/courses/route.ts`
- **Components**: `components/seo/`, `components/layout/`
- **Tests**: `tests/e2e/`, `tests/integration/`, `tests/unit/`

## Phase 3.1: Setup

- [x] T001 Extend Prisma schema with Course model in `prisma/schema.prisma`
- [x] T002 [P] Create database migration for Course table
- [x] T003 [P] Seed database with sample course data in `prisma/seed.ts`
- [x] T004 [P] Install and configure SEO dependencies: next-sitemap@^4.2.3, @next/third-parties@^14.0.0, configure next-sitemap.config.js with public routes only

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

### Critical: These tests MUST be written and MUST FAIL before ANY implementation

- [x] T005 [P] Contract test GET /api/courses in `tests/integration/api/courses.test.ts`
- [x] T006 [P] Contract test GET /sitemap.xml in `tests/integration/seo/sitemap.test.ts`
- [x] T006b [P] Security test: validate sitemap excludes non-public paths in `tests/integration/seo/sitemap-security.test.ts`
- [x] T007 [P] E2E test landing page SEO in `tests/e2e/seo.spec.ts`
- [x] T008 [P] E2E test course list functionality in `tests/e2e/courses.spec.ts`
- [x] T009 [P] Lighthouse SEO score test in `tests/e2e/lighthouse.spec.ts`
- [x] T009b [P] Core Web Vitals validation test (LCP, FID, CLS) in `tests/e2e/performance.spec.ts`
- [x] T010 [P] Integration test course data fallbacks in `tests/integration/course-fallbacks.test.ts`

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [x] T011 [P] Course model with Prisma types in `lib/api/courses.ts`
- [x] T012 [P] SEO metadata utilities in `lib/seo/metadata.ts`
- [x] T013 [P] Schema.org JSON-LD generators in `lib/seo/schemas.ts`
- [x] T014 [P] SEO constants and configuration in `lib/seo/constants.ts`
- [x] T015 GET /api/courses endpoint with ISR support in `app/api/courses/route.ts`
- [x] T016 Landing page with SSG and hero section in `app/page.tsx`
- [x] T017 Course list page with ISR (24h revalidation) in `app/courses/page.tsx`
- [x] T018 Dynamic sitemap generation in `app/sitemap.ts`
- [x] T019 Robots.txt configuration in `app/robots.ts`

## Phase 3.4: SEO Components

- [x] T020 [P] SEOHead component for meta tags in `components/seo/SEOHead.tsx`
- [x] T021 [P] StructuredData component for JSON-LD in `components/seo/StructuredData.tsx`
- [x] T022 [P] OpenGraph component in `components/seo/OpenGraph.tsx`
- [x] T023 [P] HeroSection component for landing page in `components/layout/HeroSection.tsx`
- [x] T024 [P] CourseOverview component for course grid in `components/layout/CourseOverview.tsx`
- [x] T025 [P] RegistrationArea component for CTA in `components/layout/RegistrationArea.tsx`
- [x] T026 [P] CourseCard component for individual courses in `components/course/CourseCard.tsx`

## Phase 3.5: Integration & Configuration

- [x] T027 Configure Next.js metadata API for SEO in `app/layout.tsx`
- [x] T028 Configure ISR revalidation and cache headers
- [x] T029 Implement course data fallbacks for empty state (placeholder courses with "Bald verfügbar")
- [x] T030 Add Schema.org structured data to all pages
- [x] T031 Configure public/private route protection in sitemap (exclude /auth, /protected, /api/auth paths)

## Phase 3.6: Polish & Validation

- [x] T032 [P] Unit tests for SEO utilities in `tests/unit/seo/metadata.test.ts` ✅
- [x] T033 [P] Unit tests for Course components in `tests/unit/components/course-card.test.ts` ✅
- [x] T034 [P] Unit tests for SEO components in `tests/unit/components/seo-components.test.ts` ✅
- [x] T035 Performance optimization: validate Core Web Vitals LCP < 2.5s, FID < 100ms, CLS < 0.1 ✅
- [x] T036 Accessibility audit and WCAG 2.1 AA compliance ✅
- [x] T037 [P] Update project documentation in `docs/feature-002-docs.md` ✅
- [x] T038 Run quickstart validation checklist ✅

## Dependencies

```text
Setup Dependencies:
T001 → T002 → T003 (Database schema → migration → seed)
T004 can run parallel to database setup

Test Dependencies:
T005-T010 must complete BEFORE any T011-T031 implementation
All test tasks (T005-T010) can run in parallel
T006b (security test) validates T031 implementation
T009b (performance test) validates T035 implementation

Core Implementation Dependencies:
T011 (Course model) → T015 (API endpoint)
T012-T014 (SEO utilities) → T020-T022 (SEO components)
T015 (API) → T016-T017 (Pages that consume API)
T012-T014 (SEO utilities) → T018-T019 (Sitemap/robots)

Component Dependencies:
T020-T026 (Components) → T027-T031 (Integration)
T023-T026 (Layout components) → T016-T017 (Pages)

Polish Dependencies:
T011-T031 (All implementation) → T032-T038 (Polish/validation)
```

## Parallel Execution Examples

### Setup Phase (can run together)

```text
Task: "Create database migration for Course table"
Task: "Seed database with sample course data in prisma/seed.ts"  
Task: "Install SEO dependencies (next-sitemap, @next/third-parties)"
```

### Tests Phase (all parallel - different files)

```text
Task: "Contract test GET /api/courses in tests/integration/api/courses.test.ts"
Task: "Contract test GET /sitemap.xml in tests/integration/seo/sitemap.test.ts"
Task: "Security test: validate sitemap excludes non-public paths in tests/integration/seo/sitemap-security.test.ts"
Task: "E2E test landing page SEO in tests/e2e/seo.spec.ts"
Task: "E2E test course list functionality in tests/e2e/courses.spec.ts"
Task: "Lighthouse SEO score test in tests/e2e/lighthouse.spec.ts"
Task: "Core Web Vitals validation test (LCP, FID, CLS) in tests/e2e/performance.spec.ts"
Task: "Integration test course data fallbacks in tests/integration/course-fallbacks.test.ts"
```

### Core Utilities (parallel - different files)

```text
Task: "Course model with Prisma types in lib/api/courses.ts"
Task: "SEO metadata utilities in lib/seo/metadata.ts"
Task: "Schema.org JSON-LD generators in lib/seo/schemas.ts"
Task: "SEO constants and configuration in lib/seo/constants.ts"
```

### SEO Components (all parallel - different files)

```text
Task: "SEOHead component for meta tags in components/seo/SEOHead.tsx"
Task: "StructuredData component for JSON-LD in components/seo/StructuredData.tsx"
Task: "OpenGraph component in components/seo/OpenGraph.tsx"
Task: "HeroSection component for landing page in components/layout/HeroSection.tsx"
Task: "CourseOverview component for course grid in components/layout/CourseOverview.tsx"
Task: "RegistrationArea component for CTA in components/layout/RegistrationArea.tsx"
Task: "CourseCard component for individual courses in components/course/CourseCard.tsx"
```

### Unit Tests (parallel - different directories)

```text
Task: "Unit tests for SEO utilities in tests/unit/seo/metadata.test.ts"
Task: "Unit tests for Schema.org generators in tests/unit/seo/schemas.test.ts" 
Task: "Unit tests for Course components in tests/unit/components/course/"
```

## Critical Implementation Notes

### TDD Requirements

- ALL tests (T005-T010) MUST be written first and MUST FAIL
- Run `npm test` after each test creation to verify failure
- Only proceed to implementation after all tests are failing
- Each implementation task should make specific tests pass

### SEO Requirements

- Lighthouse SEO score ≥ 90 (validated in T009)
- Schema.org structured data for Organization, WebPage, Course
- Meta descriptions 150-160 characters optimal
- Open Graph tags for social sharing

### Performance Requirements

- Landing page: SSG for instant loading
- Course list: ISR with 24-hour revalidation  
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- Database queries optimized for public course filtering

### Integration Requirements

- Course model extends existing Prisma schema
- API routes follow Next.js 14 App Router conventions
- Components use Material-UI for consistency
- TypeScript strict mode compliance

## Success Validation

Execute quickstart.md validation after T038:

- Landing page loads with SSG performance
- Course list displays with ISR functionality  
- SEO meta tags present and valid
- Structured data passes Google Rich Results Test
- Lighthouse SEO score ≥ 90
- API contracts return expected data format  
- Sitemap/robots reflect only public routes.  
- E2E and unit tests green; docs gates green.
