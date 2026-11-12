import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { ExamCard } from '@/components/exams/ExamCard';
import { officialExams, questions } from '@/data/catalog';
import { countExamQuestions } from '@/lib/exams';

export const metadata: Metadata = {
  title: 'Provas',
};

export default function AppProvasPage() {
  return (
    <section className="section">
      <header className="page-hero">
        <span className="section-header__eyebrow">Área do aluno</span>
        <h1 className="page-hero__title">Provas do acervo</h1>
        <p className="page-hero__description">
          Os doze cadernos oficiais de 2022 a 2024, prontos para virar sua trilha de estudo. Clique
          em uma prova para ver os detalhes.
        </p>
      </header>

      <p className="editorial-note" style={{ marginTop: 'var(--space-md)' }}>
        Escolha uma prova para responder e salvar seu score.
      </p>

      <div className="grid-3" style={{ marginTop: 'var(--space-lg)' }}>
        {officialExams.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            questionCount={countExamQuestions(questions, exam)}
            href={`/app/provas/${exam.id}`}
          />
        ))}
      </div>

      <div className="row" style={{ marginTop: 'var(--space-lg)' }}>
        <Link href="/provas" className="btn btn--ghost">
          Ver o catálogo público com filtros
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
