'use client';

import { Sidebar } from '@/components/sidebar';
import { useAuth } from '@/lib/auth-context';
import { PageSpinner } from '@/components/ui';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();

  if (loading || !user) {
    return <PageSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 md:pl-60">
      <Sidebar />
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
