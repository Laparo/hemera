import { MetadataRoute } from 'next';
import { getPublishedCourses } from '@/lib/api/courses';
import { SITEMAP_CONFIG } from '@/lib/seo/constants';

/**
 * Dynamic sitemap generation
 *
 * Generates sitemap.xml with:
 * - Static pages (homepage, courses list)
 * - Dynamic course pages
 * - Proper change frequencies and priorities
 * - Security filtering of non-public paths
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await getPublishedCourses();
  const baseUrl = SITEMAP_CONFIG.baseUrl;
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: SITEMAP_CONFIG.changeFrequency.homepage,
      priority: SITEMAP_CONFIG.priority.homepage,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: now,
      changeFrequency: SITEMAP_CONFIG.changeFrequency.courses,
      priority: SITEMAP_CONFIG.priority.courseList,
    },
  ];

  // Dynamic course pages
  const coursePages: MetadataRoute.Sitemap = courses.map(course => ({
    url: `${baseUrl}/courses/${course.slug}`,
    lastModified: course.updatedAt,
    changeFrequency: SITEMAP_CONFIG.changeFrequency.static,
    priority: SITEMAP_CONFIG.priority.individualCourse,
  }));

  return [...staticPages, ...coursePages];
}
