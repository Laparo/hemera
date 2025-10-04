import { FC } from 'react';
import Head from 'next/head';

/**
 * SEOHead component for meta tags
 * 
 * Provides programmatic control over SEO meta tags for:
 * - Title optimization
 * - Meta descriptions
 * - Canonical URLs
 * - Additional meta tags
 * - Viewport and character encoding
 */

export interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  noIndex?: boolean;
  additionalMeta?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
}

export const SEOHead: FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  noIndex = false,
  additionalMeta = [],
}) => {
  return (
    <Head>
      {/* Basic Meta Tags */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Robots Meta */}
      <meta
        name="robots"
        content={noIndex ? 'noindex, nofollow' : 'index, follow'}
      />
      
      {/* Viewport and Encoding */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      
      {/* Additional Meta Tags */}
      {additionalMeta.map((meta, index) => (
        <meta
          key={index}
          {...(meta.name ? { name: meta.name } : {})}
          {...(meta.property ? { property: meta.property } : {})}
          content={meta.content}
        />
      ))}
      
      {/* Basic SEO Meta Tags */}
      <meta name="author" content="Hemera Academy" />
      <meta name="language" content="en" />
      <meta name="revisit-after" content="7 days" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="format-detection" content="email=no" />
      <meta name="format-detection" content="address=no" />
    </Head>
  );
};

export default SEOHead;