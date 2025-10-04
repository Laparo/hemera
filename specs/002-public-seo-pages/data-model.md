# Data Model: Public SEO Pages

## Course Entity

### Properties
- `id`: String (UUID) - Unique identifier
- `title`: String - Course name for public display
- `description`: String - Course description for SEO and cards
- `slug`: String - URL-friendly identifier for course pages
- `imageUrl`: String? - Optional course image for cards and OG tags
- `level`: String - Beginner, Intermediate, Advanced
- `duration`: String - Estimated completion time (e.g., "4 weeks")
- `price`: Decimal? - Course price (optional for free courses)
- `status`: Enum - DRAFT, PUBLISHED, ARCHIVED
- `isPublic`: Boolean - Visibility flag for public pages
- `createdAt`: DateTime - Record creation timestamp
- `updatedAt`: DateTime - Last modification timestamp

### Validation Rules
- `title`: Required, 3-100 characters
- `description`: Required, 50-500 characters for SEO optimization
- `slug`: Required, unique, URL-safe (a-z, 0-9, hyphens)
- `level`: Must be one of predefined values
- `duration`: Required, human-readable format
- `status`: Defaults to DRAFT
- `isPublic`: Defaults to false for safety

### State Transitions
- DRAFT → PUBLISHED (when course is ready for public display)
- PUBLISHED → ARCHIVED (when course is no longer offered)
- Any status → DRAFT (for editing)

### Relationships
- None initially (extensible for future features like instructors, categories)

## SEO Metadata Entity (Embedded)

### Properties per Page
- `title`: String - SEO title (50-60 characters optimal)
- `description`: String - Meta description (150-160 characters)
- `keywords`: String[] - Relevant keywords for content
- `ogImage`: String? - Open Graph image URL
- `canonicalUrl`: String - Canonical URL for duplicate prevention

### Schema.org Structured Data

#### Organization Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Hemera",
  "url": "https://hemera.example.com",
  "logo": "https://hemera.example.com/logo.png"
}
```

#### WebPage Schema (Landing Page)
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Landing Page Title",
  "description": "Page description",
  "url": "https://hemera.example.com"
}
```

#### Course Schema (Course List)
```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Course Title",
  "description": "Course description",
  "provider": {
    "@type": "Organization",
    "name": "Hemera"
  },
  "educationalLevel": "Beginner|Intermediate|Advanced",
  "timeRequired": "PT4W"
}
```

## API Data Contracts

### Course List Response
```typescript
interface CourseListResponse {
  courses: PublicCourse[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}

interface PublicCourse {
  id: string;
  title: string;
  description: string;
  slug: string;
  imageUrl?: string;
  level: CourseLevel;
  duration: string;
  price?: number;
}

type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
```

### Fallback Data Structure
```typescript
interface PlaceholderCourse {
  id: 'placeholder-{index}';
  title: 'Spannender Kurs kommt bald';
  description: 'Wir arbeiten an einem großartigen neuen Kurs. Bleiben Sie dran!';
  slug: 'coming-soon-{index}';
  level: 'Beginner';
  duration: 'Bald verfügbar';
  status: 'COMING_SOON';
}
```

## Database Schema Extension

### Prisma Schema Addition
```prisma
model Course {
  id          String   @id @default(cuid())
  title       String
  description String
  slug        String   @unique
  imageUrl    String?
  level       CourseLevel
  duration    String
  price       Decimal?
  status      CourseStatus @default(DRAFT)
  isPublic    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("courses")
}

enum CourseLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

enum CourseStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

## SEO Requirements Mapping

### Landing Page Data Needs
- Organization information (static)
- Course overview data (dynamic, from API)
- Hero content (static with dynamic course count)
- Registration area (static)

### Course List Page Data Needs
- Published courses with public visibility
- Course metadata for individual cards
- Structured data for each course
- Pagination metadata

### Sitemap Data Needs
- All public course slugs for dynamic URLs
- Last modification dates for cache headers
- Priority scores based on content importance