import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { AppShell } from '@/components/layout/AppShell';
import { getSession } from '@/lib/auth';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Shell da área do aluno: valida a sessão no servidor (não confia só no
 * proxy) e envolve as rotas internas na navegação fixa.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getSession();
  if (!user) redirect('/entrar?next=/app');

  return <AppShell user={user}>{children}</AppShell>;
}
