import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { getSession } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Início',
};

export default async function AppHomePage() {
  const user = await getSession();
  if (!user) redirect('/entrar?next=/app');

  return <DashboardClient user={user} />;
}
