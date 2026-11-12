import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

import { RegisterForm } from '@/components/auth/RegisterForm';
import { Logo } from '@/components/ui/Logo';
import { getSession, sanitizeNextPath } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Criar conta',
  robots: { index: false, follow: false },
};

const BENEFITS = [
  'Conteúdo gratuito: provas, teoria e simulados',
  'Seu progresso por área fica salvo entre sessões',
  'Sem cartão de crédito e sem plano pago',
];

interface CriarContaPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function CriarContaPage({ searchParams }: CriarContaPageProps) {
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
            Criar conta
          </h2>
          <p className="auth-card__subtitle">
            Leva menos de um minuto. Depois você já entra direto na sua área.
          </p>

          <RegisterForm nextPath={nextPath} isMockMode={process.env.AUTH_MODE !== 'api'} />
        </div>
      </section>
    </main>
  );
}
