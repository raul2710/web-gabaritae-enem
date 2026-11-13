import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertTriangle, ArrowLeft, ArrowRight, BookOpen, Clock, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { ENEM_DISCIPLINES } from '@/domain/constants';
import { getTheoryModules } from '@/lib/api';

export async function generateMetadata({ params }: AppDisciplinePageProps): Promise<Metadata> {
  const { discipline } = await params;
  const area = ENEM_DISCIPLINES.find((item) => item.id === discipline);

  if (!area) return { title: 'Área não encontrada', robots: { index: false, follow: false } };

  return { title: `Estudar · ${area.name}`, robots: { index: false, follow: false } };
}

interface AppDisciplinePageProps {
  params: Promise<{ discipline: string }>;
}

export default async function AppDisciplinePage({ params }: AppDisciplinePageProps) {
  const { discipline } = await params;

  const area = ENEM_DISCIPLINES.find((item) => item.id === discipline);
  if (!area) notFound();

  const allModules = await getTheoryModules();
  const modules = allModules[area.id] ?? [];

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
            <BookOpen size={14} aria-hidden="true" />
            {modules.length} {modules.length === 1 ? 'apostila' : 'apostilas'}
          </Badge>
        </div>

        <h1 className="page-hero__title" style={{ marginTop: 'var(--space-sm)' }}>
          {area.name}
        </h1>
        <p className="page-hero__description">{area.shortDesc}</p>
      </header>

      <div className="theory-list">
        {modules.map((mod) => (
          <article key={mod.id} className="theory-card">
            <header className="theory-card__header">
              <div className="row">
                <Badge tone="primary">{mod.subject}</Badge>
                <Badge tone="warning">
                  <Sparkles size={13} aria-hidden="true" />
                  {mod.incidence}
                </Badge>
                <span className="theory-card__reading">
                  <Clock size={14} aria-hidden="true" />
                  {mod.readingTime}
                </span>
              </div>

              <h2 className="theory-card__title">{mod.title}</h2>
              <p className="theory-card__summary">{mod.summary}</p>
            </header>

            {mod.imageUrl ? (
              <figure className="theory-card__figure">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mod.imageUrl} alt={mod.title} loading="lazy" />
                {mod.imageCaption ? <figcaption>{mod.imageCaption}</figcaption> : null}
              </figure>
            ) : null}

            <div className="theory-card__sections">
              {mod.sections.map((section) => (
                <div key={section.heading} className="theory-section">
                  <h3 className="theory-section__heading">{section.heading}</h3>
                  <p className="theory-section__body">{section.body}</p>
                </div>
              ))}
            </div>

            {mod.keyFormulas && mod.keyFormulas.length > 0 ? (
              <div className="theory-formulas">
                <h3 className="theory-formulas__title">Fórmulas e conceitos-chave</h3>
                <ul className="theory-formulas__list">
                  {mod.keyFormulas.map((formula) => (
                    <li key={formula} className="theory-formulas__item">
                      <code>{formula}</code>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {mod.enemTrap ? (
              <aside className="theory-trap" aria-label={mod.enemTrap.title}>
                <div className="theory-trap__header">
                  <AlertTriangle size={18} aria-hidden="true" />
                  <h3 className="theory-trap__title">{mod.enemTrap.title}</h3>
                </div>
                <p className="theory-trap__wrong">
                  <strong>Erro comum:</strong> {mod.enemTrap.wrongThinking}
                </p>
                <p className="theory-trap__correct">
                  <strong>Como o ENEM cobra:</strong> {mod.enemTrap.correctThinking}
                </p>
              </aside>
            ) : null}
          </article>
        ))}
      </div>

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
