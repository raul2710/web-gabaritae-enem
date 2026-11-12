import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { ENEM_DISCIPLINES } from '@/domain/constants';

export async function generateMetadata({ params }: AppDisciplinePageProps): Promise<Metadata> {
  const { discipline } = await params;
  const area = ENEM_DISCIPLINES.find((item) => item.id === discipline);

  if (!area) return { title: 'Área não encontrada', robots: { index: false, follow: false } };

  return { title: `Estudar · ${area.name}`, robots: { index: false, follow: false } };
}

interface AppDisciplinePageProps {
  params: Promise<{ discipline: string }>;
}

/** Placeholder por área: valida o slug e evita 404 nos links do grid. */
export default async function AppDisciplinePage({ params }: AppDisciplinePageProps) {
  const { discipline } = await params;

  const area = ENEM_DISCIPLINES.find((item) => item.id === discipline);
  if (!area) notFound();

  return (
    <section className="section">
      <nav className="breadcrumb" aria-label="Trilha de navegação">
        <Link href="/app">Início</Link>
        <span className="breadcrumb__sep" aria-hidden="true">
          /
        </span>
        <Link href="/app/estudar">Estudar</Link>
        <span className="breadcrumb__sep" aria-hidden="true">
          /
        </span>
        <span aria-current="page">{area.name}</span>
      </nav>

      <header className="page-hero" style={{ marginTop: 'var(--space-lg)' }}>
        <div className="row">
          <Badge tone="primary">{area.code}</Badge>
          <Badge>{area.fullName}</Badge>
        </div>

        <h1 className="page-hero__title" style={{ marginTop: 'var(--space-sm)' }}>
          {area.name}
        </h1>
        <p className="page-hero__description">{area.shortDesc}</p>
      </header>

      <p className="editorial-note" style={{ marginTop: 'var(--space-md)' }}>
        Os módulos de teoria desta área — resumos, fórmulas e pegadinhas clássicas — serão
        implementados na próxima fase. Enquanto isso, resolva as provas filtradas por esta área para
        treinar de verdade.
      </p>

      <div className="row" style={{ marginTop: 'var(--space-lg)' }}>
        <Link href={`/provas?disciplina=${area.id}`} className="btn btn--primary">
          Ver provas desta área
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link href="/app/estudar" className="btn btn--secondary">
          <ArrowLeft size={16} aria-hidden="true" />
          Todas as áreas
        </Link>
      </div>
    </section>
  );
}
