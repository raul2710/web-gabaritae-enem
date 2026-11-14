import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { ResumosClient } from '@/components/notes/ResumosClient';
import { getSession } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Resumos',
};

export default async function AppResumosPage() {
  const user = await getSession();
  if (!user) redirect('/entrar?next=/app/resumos');

  return <ResumosClient user={user} />;
}

