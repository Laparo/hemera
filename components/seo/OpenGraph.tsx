import { FC } from 'react';
import Head from 'next/head';

/**
 * OpenGraph component for social media sharing
 * 
 * Provides Open Graph and Twitter Card meta tags for:
 * - Social media sharing optimization
 * - Rich previews on Facebook, LinkedIn, Twitter
 * - Image and content optimization
 * - Article and website type support
 */

export interface OpenGraphProps {
  title: string;
  description: string;
  url: string;
  type?: 'website' | 'article';
  siteName?: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image';
    site?: string;
    creator?: string;
  };
}

export const OpenGraph: FC<OpenGraphProps> = ({
  title,
  description,
  url,
  type = 'website',
  siteName = 'Hemera Academy',
  image,
  article,
  twitter,
}) => {
  return (
    <Head>
      {/* Basic Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Open Graph Image */}
      {image && (
        <>
          <meta property="og:image" content={image.url} />
          {image.width && <meta property="og:image:width" content={String(image.width)} />}
          {image.height && <meta property="og:image:height" content={String(image.height)} />}
          {image.alt && <meta property="og:image:alt" content={image.alt} />}
        </>
      )}

      {/* Article-specific Open Graph Tags */}
      {type === 'article' && article && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.section && (
            <meta property="article:section" content={article.section} />
          )}
          {article.tags && article.tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitter?.card || 'summary_large_image'} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image.url} />}
      {twitter?.site && <meta name="twitter:site" content={twitter.site} />}
      {twitter?.creator && <meta name="twitter:creator" content={twitter.creator} />}
    </Head>
  );
};

export default OpenGraph;