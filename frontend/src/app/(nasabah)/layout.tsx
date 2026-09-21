'use client';

import { Navbar } from '@/components/navbar';
import { useAuth } from '@/lib/auth-context';
import { PageSpinner } from '@/components/ui';

export default function NasabahLayout({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();

  if (loading || !user) {
    return <PageSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
