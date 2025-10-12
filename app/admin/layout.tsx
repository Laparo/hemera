/**
 * Admin Layout
 * Layout für Admin-Bereiche
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Hemera',
  description: 'Administrative functions and monitoring',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
