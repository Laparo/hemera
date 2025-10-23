import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { generateSEOMetadata, truncateDescription } from '@/lib/seo/metadata';
import { SITE_CONFIG } from '@/lib/seo/constants';

// Note: Default layout component only needs to render children. Avoid over-typing props to satisfy Next's validator types.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    // Use relative fetch to work in both dev and prod, and keep absolute URLs only for canonical
    const res = await fetch(`/api/courses/${encodeURIComponent(id)}`, {
      // Metadata is static-ish but course content can change; allow a short revalidate window
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      // Fallback metadata when course is not found
      return generateSEOMetadata({
        title: 'Kurs',
        description: 'Kursdetails und Informationen.',
        canonicalUrl: `${SITE_CONFIG.url}/courses/${id}`,
      });
    }

    const payload = await res.json();
    const course = payload?.data as
      | {
          id: string;
          title: string;
          description?: string | null;
          slug?: string;
        }
      | undefined;

    const title = course?.title ?? 'Kurs';
    const description = truncateDescription(
      course?.description ??
        'Kursdetails der Hemera Academy: Inhalte, Termine und Buchungsinformationen.',
      160
    );
    // Kurs-spezifisches OG-Bild per Konvention (Fallback auf Default in SEO util)
    const ogImage = course?.slug
      ? `/images/courses/${course.slug}.jpg`
      : undefined;

    return generateSEOMetadata({
      title,
      description,
      canonicalUrl: `${SITE_CONFIG.url}/courses/${id}`,
      ogImage,
    });
  } catch (_) {
    // Network or parsing error – provide minimal but valid metadata
    return generateSEOMetadata({
      title: 'Kurs',
      description: 'Kursdetails und Informationen.',
      canonicalUrl: `${SITE_CONFIG.url}/courses/${id}`,
    });
  }
}

export default function CourseDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
