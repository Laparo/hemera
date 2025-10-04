import * as React from 'react';
import { Metadata } from 'next';
import ThemeRegistry from '@/components/ThemeRegistry';
import { SITE_CONFIG, SEO_DEFAULTS, IMAGE_CONFIG } from '@/lib/seo/constants';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    template: SEO_DEFAULTS.title.template,
    default: SEO_DEFAULTS.title.default,
  },
  description: SEO_DEFAULTS.description.default,
  keywords: [...SEO_DEFAULTS.keywords],
  authors: [{ name: 'Hemera Academy' }],
  creator: 'Hemera Academy',
  publisher: 'Hemera Academy',
  applicationName: SITE_CONFIG.name,
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: SITE_CONFIG.name,
    title: SEO_DEFAULTS.title.default,
    description: SEO_DEFAULTS.description.default,
    images: [
      {
        url: IMAGE_CONFIG.og.default,
        width: IMAGE_CONFIG.og.width,
        height: IMAGE_CONFIG.og.height,
        alt: IMAGE_CONFIG.og.alt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@hemeraacademy',
    creator: '@hemeraacademy',
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
  icons: {
    icon: [
      { url: IMAGE_CONFIG.favicon.ico },
      { url: IMAGE_CONFIG.favicon.svg, type: 'image/svg+xml' },
      { url: IMAGE_CONFIG.favicon.png192, sizes: '192x192', type: 'image/png' },
      { url: IMAGE_CONFIG.favicon.png512, sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: IMAGE_CONFIG.favicon.apple, sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
