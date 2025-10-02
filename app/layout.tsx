import * as React from 'react';
import ThemeRegistry from '@/components/ThemeRegistry';

export const metadata = {
  title: 'Hemera',
  description: 'Auth baseline with Next.js App Router',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
