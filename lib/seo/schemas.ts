import type { Course } from '@prisma/client';

/**
 * Schema.org JSON-LD generators for structured data
 *
 * Provides type-safe generation of structured data for:
 * - Organization schema
 * - WebPage schema
 * - Course schema
 * - BreadcrumbList schema
 * - WebSite schema with search action
 */

const ORGANIZATION_CONFIG = {
  name: 'Hemera Academy',
  description:
    'Transform your career with expert-led courses in technology, business, and creative skills.',
  url: 'https://hemera.academy',
  logo: 'https://hemera.academy/images/logo.png',
  email: 'contact@hemera.academy',
  sameAs: [
    'https://twitter.com/hemeraacademy',
    'https://linkedin.com/company/hemera-academy',
  ],
} as const;

/**
 * Generate Organization schema (for all pages)
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORGANIZATION_CONFIG.name,
    description: ORGANIZATION_CONFIG.description,
    url: ORGANIZATION_CONFIG.url,
    logo: {
      '@type': 'ImageObject',
      url: ORGANIZATION_CONFIG.logo,
      width: 200,
      height: 60,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: ORGANIZATION_CONFIG.email,
      contactType: 'customer service',
    },
    sameAs: ORGANIZATION_CONFIG.sameAs,
  };
}

/**
 * Generate WebSite schema with search action (for landing page)
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: ORGANIZATION_CONFIG.name,
    description: ORGANIZATION_CONFIG.description,
    url: ORGANIZATION_CONFIG.url,
    publisher: {
      '@type': 'Organization',
      name: ORGANIZATION_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: ORGANIZATION_CONFIG.logo,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${ORGANIZATION_CONFIG.url}/courses?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate WebPage schema for landing page
 */
export function generateLandingPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Hemera Academy - Transform Your Career with Expert-Led Courses',
    description:
      'Transform your career with expert-led courses in technology, business, and creative skills. Join thousands of students advancing their careers.',
    url: ORGANIZATION_CONFIG.url,
    isPartOf: {
      '@type': 'WebSite',
      name: ORGANIZATION_CONFIG.name,
      url: ORGANIZATION_CONFIG.url,
    },
    about: {
      '@type': 'Thing',
      name: 'Online Education',
      description: 'Professional development through online courses',
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'Professionals seeking career advancement',
    },
    provider: {
      '@type': 'Organization',
      name: ORGANIZATION_CONFIG.name,
      url: ORGANIZATION_CONFIG.url,
    },
  };
}

/**
 * Generate WebPage schema for course list page
 */
export function generateCourseListPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'All Courses - Hemera Academy',
    description:
      'Explore our complete catalog of expert-led courses in technology, business, and creative skills.',
    url: `${ORGANIZATION_CONFIG.url}/courses`,
    isPartOf: {
      '@type': 'WebSite',
      name: ORGANIZATION_CONFIG.name,
      url: ORGANIZATION_CONFIG.url,
    },
    about: {
      '@type': 'Thing',
      name: 'Online Courses',
      description: 'Professional development courses',
    },
    provider: {
      '@type': 'Organization',
      name: ORGANIZATION_CONFIG.name,
      url: ORGANIZATION_CONFIG.url,
    },
  };
}

/**
 * Generate Course schema for individual course pages
 */
export function generateCourseSchema(course: Course) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    url: `${ORGANIZATION_CONFIG.url}/courses/${course.slug}`,
    courseCode: course.slug.toUpperCase(),
    educationalLevel: course.level,
    timeRequired: `PT${course.duration}M`, // ISO 8601 duration format (assuming duration is in minutes)
    offers: {
      '@type': 'Offer',
      price: course.price ? Number(course.price) : 0, // Convert Decimal to number
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: course.createdAt.toISOString(),
    },
    provider: {
      '@type': 'Organization',
      name: ORGANIZATION_CONFIG.name,
      url: ORGANIZATION_CONFIG.url,
    },
    coursePrerequisites:
      course.level === 'ADVANCED' ? 'Basic knowledge recommended' : undefined,
    audience: {
      '@type': 'Audience',
      audienceType: 'Professionals',
      educationalRole: 'student',
    },
    dateCreated: course.createdAt.toISOString(),
    dateModified: course.updatedAt.toISOString(),
    inLanguage: 'en-US',
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http')
        ? item.url
        : `${ORGANIZATION_CONFIG.url}${item.url}`,
    })),
  };
}

/**
 * Generate ItemList schema for course collections
 */
export function generateCourseListSchema(courses: Course[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Hemera Academy Courses',
    description: 'Complete list of available courses',
    numberOfItems: courses.length,
    itemListElement: courses.map((course, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Course',
        name: course.title,
        description: course.description,
        url: `${ORGANIZATION_CONFIG.url}/courses/${course.slug}`,
        offers: {
          '@type': 'Offer',
          price: course.price ? Number(course.price) : 0,
          priceCurrency: 'USD',
        },
      },
    })),
  };
}

/**
 * Generate FAQ schema (for future use)
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate multiple schemas as JSON-LD string
 */
export function generateMultipleSchemas(schemas: object[]): string {
  return JSON.stringify(schemas.length === 1 ? schemas[0] : schemas, null, 2);
}

/**
 * Validate and sanitize schema data
 */
export function sanitizeSchemaData<T extends Record<string, any>>(data: T): T {
  const sanitized = { ...data };

  // Remove undefined values
  Object.keys(sanitized).forEach(key => {
    if (sanitized[key] === undefined) {
      delete sanitized[key];
    }
  });

  return sanitized;
}

/**
 * Common schema combinations for pages
 */
export const SCHEMA_COMBINATIONS = {
  landingPage: () => [
    generateOrganizationSchema(),
    generateWebSiteSchema(),
    generateLandingPageSchema(),
  ],

  courseList: (courses: Course[]) => [
    generateOrganizationSchema(),
    generateCourseListPageSchema(),
    generateCourseListSchema(courses),
  ],

  coursePage: (course: Course) => [
    generateOrganizationSchema(),
    generateCourseSchema(course),
    generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Courses', url: '/courses' },
      { name: course.title, url: `/courses/${course.slug}` },
    ]),
  ],
} as const;
