import ThemeRegistry from '@/components/ThemeRegistry';
import { ClerkProvider } from '@clerk/nextjs';
import * as React from 'react';

export const metadata = {
  title: 'Hemera',
  description: 'Auth baseline with Next.js App Router',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang='de'>
        <body>
          <ThemeRegistry>{children}</ThemeRegistry>
        </body>
      </html>
    </ClerkProvider>
  );
}
