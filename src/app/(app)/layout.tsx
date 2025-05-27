import { AppShell } from '@/components/layout/AppShell';
import type React from 'react';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
