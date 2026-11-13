import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, Repeat } from 'lucide-react';

import { StudyGoalCard } from '@/components/dashboard/StudyGoalCard';
import { LogoutButton } from '@/components/layout/LogoutButton';
import { Avatar } from '@/components/ui/Avatar';
import { getSession } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Perfil',
};

export default async function AppPerfilPage() {
  const user = await getSession();
  if (!user) redirect('/entrar?next=/app/perfil');

  return (
    <section className="section">
      <header className="page-hero">
        <span className="section-header__eyebrow">Área do aluno</span>
        <h1 className="page-hero__title">Seu perfil</h1>
        <p className="page-hero__description">
          Os dados abaixo vêm da sessão atual (cookie de autenticação). Nada de senha fica guardada
          no navegador.
        </p>
      </header>

      <div style={{ marginTop: 'var(--space-lg)', maxWidth: '720px' }}>
        <StudyGoalCard userId={user.id} />
      </div>

      <div className="card" style={{ marginTop: 'var(--space-lg)', maxWidth: '560px' }}>
        <div className="row">
          <Avatar name={user.name} image={user.avatarUrl} size="lg" />
          <div>
            <p style={{ fontWeight: 600 }}>{user.name}</p>
            <p className="meta">{user.email}</p>
          </div>
        </div>

        <dl className="exam-summary" style={{ marginTop: 'var(--space-lg)' }}>
          <div>
            <dt>Identificador</dt>
            <dd>{user.id}</dd>
          </div>
          <div>
            <dt>E-mail</dt>
            <dd>{user.email}</dd>
          </div>
        </dl>

        <div className="row" style={{ marginTop: 'var(--space-md)' }}>
          <LogoutButton>Sair desta conta</LogoutButton>
        </div>
      </div>

      <div className="card card--tonal" style={{ marginTop: 'var(--space-md)', maxWidth: '560px' }}>
        <h2 className="step__title">Trocar de conta</h2>
        <p className="meta" style={{ marginTop: 'var(--space-xs)' }}>
          Entre com outra conta ou crie um novo cadastro — a sessão atual é substituída com
          segurança.
        </p>

        <div className="row" style={{ marginTop: 'var(--space-md)' }}>
          <Link href="/entrar?next=/app/perfil" className="btn btn--secondary btn--sm">
            <Repeat size={16} aria-hidden="true" />
            Entrar com outra conta
          </Link>
          <Link href="/criar-conta?next=/app/perfil" className="btn btn--ghost btn--sm">
            Criar nova conta
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
