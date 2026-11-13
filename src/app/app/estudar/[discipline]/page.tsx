import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

import { EstudarAreaClient } from '@/components/modules/EstudarAreaClient';
import { Badge } from '@/components/ui/Badge';
import { ENEM_DISCIPLINES } from '@/domain/constants';
import { fetchApostilas, fetchModulos } from '@/lib/api';

export async function generateMetadata({ params }: AppDisciplinePageProps): Promise<Metadata> {
  const { discipline } = await params;
  const area = ENEM_DISCIPLINES.find((item) => item.id === discipline);

  if (!area) return { title: 'Área não encontrada', robots: { index: false, follow: false } };

  return { title: `Estudar · ${area.name} · Gabaritaê ENEM`, robots: { index: false, follow: false } };
}

interface AppDisciplinePageProps {
  params: Promise<{ discipline: string }>;
}

export default async function AppDisciplinePage({ params }: AppDisciplinePageProps) {
  const { discipline } = await params;

  const area = ENEM_DISCIPLINES.find((item) => item.id === discipline);
  if (!area) notFound();

  // Carrega em paralelo os módulos curados da área e as apostilas dinâmicas
  const [modulos, allApostilas] = await Promise.all([
    fetchModulos({ area: area.name }),
    fetchApostilas(area.id),
  ]);

  const apostilas = allApostilas[area.id] ?? [];

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
          <Badge tone="primary">{area.fullName}</Badge>
          <Badge>
            <Sparkles size={14} aria-hidden="true" />
            {modulos.length} {modulos.length === 1 ? 'módulo curado' : 'módulos curados'}
          </Badge>
          <Badge>
            <BookOpen size={14} aria-hidden="true" />
            {apostilas.length} {apostilas.length === 1 ? 'apostila' : 'apostilas'}
          </Badge>
        </div>

        <h1 className="page-hero__title" style={{ marginTop: 'var(--space-sm)' }}>
          {area.name}
        </h1>
        <p className="page-hero__description">{area.shortDesc}</p>
      </header>

      {/* Interface Rica do Aluno com Módulos Curados, KaTeX, Esquemas e Offline Pack */}
      <EstudarAreaClient
        area={area}
        initialModulos={modulos}
        initialApostilas={apostilas}
      />

      <div className="row" style={{ marginTop: 'var(--space-xl)' }}>
        <Link href="/app/provas" className="btn btn--primary">
          Praticar nas provas do acervo
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
