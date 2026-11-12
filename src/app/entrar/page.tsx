import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

import { LoginForm } from '@/components/auth/LoginForm';
import { Logo } from '@/components/ui/Logo';
import { getSession, sanitizeNextPath } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Entrar',
  robots: { index: false, follow: false },
};

const BENEFITS = [
  'Score por área salvo a cada prova que você resolve',
  'Resolução comentada das provas oficiais do ENEM',
  'Simulados personalizados no seu ritmo, sem pagar nada',
];

interface EntrarPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function EntrarPage({ searchParams }: EntrarPageProps) {
  const params = await searchParams;
  const nextPath = sanitizeNextPath(params.next);

  const user = await getSession();
  if (user) redirect(nextPath);

  return (
    <main id="conteudo" className="auth-layout">
      <aside className="auth-layout__aside">
        <Logo />

        <h1 className="auth-aside__title">Seu estudo, com um score que faz sentido.</h1>

        <ul className="auth-benefits">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="auth-benefits__item">
              <CheckCircle2 className="auth-benefits__icon" size={18} aria-hidden="true" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <Link href="/" className="auth-aside__back">
          <ArrowLeft size={14} aria-hidden="true" />
          Voltar para o início
        </Link>
      </aside>

      <section className="auth-layout__panel" aria-labelledby="auth-title">
        <div className="auth-card">
          <h2 id="auth-title" className="auth-card__title">
            Entrar
          </h2>
          <p className="auth-card__subtitle">
            Acesse sua conta para continuar de onde parou e acompanhar seu score.
          </p>

          <LoginForm nextPath={nextPath} isMockMode={process.env.AUTH_MODE !== 'api'} />
        </div>
      </section>
    </main>
  );
}
