import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Compass, Globe, Leaf } from 'lucide-react';

import { ENEM_DISCIPLINES } from '@/domain/constants';

export const metadata: Metadata = {
  title: 'Estudar',
};

const AREA_ICONS = {
  matematica: Compass,
  natureza: Leaf,
  humanas: Globe,
  linguagens: BookOpen,
} as const;

export default function AppEstudarPage() {
  return (
    <section className="section">
      <header className="page-hero">
        <span className="section-header__eyebrow">Área do aluno</span>
        <h1 className="page-hero__title">Estudar por área</h1>
        <p className="page-hero__description">
          Escolha uma das quatro grandes áreas do ENEM para ver teoria, pegadinhas clássicas e as
          questões do catálogo.
        </p>
      </header>

      <div className="grid-4" style={{ marginTop: 'var(--space-lg)' }}>
        {ENEM_DISCIPLINES.map((area) => {
          const Icon = AREA_ICONS[area.id];

          return (
            <Link
              key={area.id}
              href={`/app/estudar/${area.id}`}
              className="area-card"
              style={
                {
                  '--area-accent': area.accent,
                  '--area-tint': area.tint,
                } as CSSProperties
              }
            >
              <div className="area-card__header">
                <span className="area-card__icon">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h2 className="area-card__title">{area.name}</h2>
              </div>
              <p className="area-card__description">{area.shortDesc}</p>
              <span
                className="row"
                style={{
                  marginTop: 'auto',
                  color: 'var(--primary)',
                  fontWeight: 600,
                  fontSize: 'var(--text-meta)',
                }}
              >
                Estudar apostilas
                <ArrowRight size={14} aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
