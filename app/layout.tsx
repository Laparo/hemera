import ThemeRegistry from '@/components/ThemeRegistry';
import ClerkProviderWrapper from '@/components/auth/ClerkProviderWrapper';
import { PublicNavigation } from '@/components/navigation/PublicNavigation';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import * as React from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s - Hemera Academy',
    default: 'Hemera Academy',
  },
  description:
    'Transform your career with expert-led courses in technology, business, and creative skills.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProviderWrapper>
      <html lang='de'>
        <body className={inter.className}>
          <ThemeRegistry>
            <PublicNavigation />
            {children}
          </ThemeRegistry>
        </body>
      </html>
    </ClerkProviderWrapper>
  );
}
