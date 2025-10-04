import { Metadata } from 'next';
import type { Course } from '@prisma/client';

/**
 * SEO metadata utilities for public pages
 * 
 * Provides standardized metadata generation for:
 * - Open Graph tags
 * - Twitter Card tags  
 * - Meta descriptions and titles
 * - Canonical URLs
 * - SEO-optimized content
 */

const SITE_CONFIG = {
  name: 'Hemera Academy',
  description: 'Transform your career with expert-led courses in technology, business, and creative skills.',
  url: 'https://hemera.academy',
  ogImage: '/images/og-default.jpg',
  twitterHandle: '@hemeraacademy',
} as const;

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

/**
 * Generate Next.js Metadata for landing page
 */
export function generateLandingPageMetadata(): Metadata {
  const title = 'Hemera Academy - Transform Your Career';
  const description = 'Transform your career with expert-led courses in technology, business, and creative skills. Join thousands advancing their careers.';

  return {
    title,
    description,
    keywords: [
      'online courses',
      'career development', 
      'technology training',
      'professional development',
      'skill building',
      'expert instruction'
    ],
    authors: [{ name: 'Hemera Academy' }],
    creator: 'Hemera Academy',
    publisher: 'Hemera Academy',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: '/',
      title,
      description,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: SITE_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: SITE_CONFIG.twitterHandle,
      creator: SITE_CONFIG.twitterHandle,
      images: [SITE_CONFIG.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Generate Next.js Metadata for course list page
 */
export function generateCourseListMetadata(): Metadata {
  const title = 'All Courses - Hemera Academy';
  const description = 'Explore our complete catalog of expert-led courses. Find the perfect course to advance your career in technology, business, and creative skills.';

  return {
    title,
    description,
    keywords: [
      'course catalog',
      'online learning',
      'professional courses',
      'skill development',
      'career advancement'
    ],
    authors: [{ name: 'Hemera Academy' }],
    creator: 'Hemera Academy',
    publisher: 'Hemera Academy',
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: '/courses',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: '/courses',
      title,
      description,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: SITE_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: SITE_CONFIG.twitterHandle,
      creator: SITE_CONFIG.twitterHandle,
      images: [SITE_CONFIG.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Generate Next.js Metadata for individual course page
 */
export function generateCourseMetadata(course: Course): Metadata {
  const title = `${course.title} - Hemera Academy`;
  const description = course.description.length > 160 
    ? `${course.description.substring(0, 157)}...`
    : course.description;

  return {
    title,
    description,
    keywords: [
      course.title.toLowerCase(),
      course.level.toLowerCase(),
      'online course',
      'professional development'
    ],
    authors: [{ name: 'Hemera Academy' }],
    creator: 'Hemera Academy',
    publisher: 'Hemera Academy',
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: `/courses/${course.slug}`,
    },
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url: `/courses/${course.slug}`,
      title,
      description,
      siteName: SITE_CONFIG.name,
      publishedTime: course.createdAt.toISOString(),
      modifiedTime: course.updatedAt.toISOString(),
      images: [
        {
          url: SITE_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: SITE_CONFIG.twitterHandle,
      creator: SITE_CONFIG.twitterHandle,
      images: [SITE_CONFIG.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Generate custom SEO metadata object
 */
export function generateSEOMetadata(config: SEOMetadata): Metadata {
  const fullTitle = config.title.includes(SITE_CONFIG.name) 
    ? config.title 
    : `${config.title} | ${SITE_CONFIG.name}`;

  return {
    title: fullTitle,
    description: config.description,
    keywords: config.keywords,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: config.canonicalUrl ? {
      canonical: config.canonicalUrl,
    } : undefined,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: config.canonicalUrl || '/',
      title: fullTitle,
      description: config.description,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: config.ogImage || SITE_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: config.description,
      site: SITE_CONFIG.twitterHandle,
      creator: SITE_CONFIG.twitterHandle,
      images: [config.ogImage || SITE_CONFIG.ogImage],
    },
    robots: config.noIndex ? {
      index: false,
      follow: false,
    } : {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Truncate text for SEO descriptions
 */
export function truncateDescription(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  const truncated = text.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 
    ? `${truncated.substring(0, lastSpace)}...`
    : `${truncated}...`;
}

/**
 * Generate breadcrumb schema for SEO
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}