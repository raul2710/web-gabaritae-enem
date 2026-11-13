import Link from 'next/link';
import type { Metadata } from 'next';
import { SearchX, X } from 'lucide-react';

import { ExamCard } from '@/components/exams/ExamCard';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { officialExams, questions } from '@/data/catalog';
import { ENEM_DISCIPLINES } from '@/domain/constants';
import { getSession } from '@/lib/auth';
import {
  EXAM_BOOKLET_COLORS,
  EXAM_DISCIPLINES,
  EXAM_YEARS,
  buildExamListHref,
  countExamQuestions,
  filterExams,
  hasActiveFilters,
  normalizeFilters,
} from '@/lib/exams';

const SITE_NAME = 'Gabaritaê ENEM';

const DESCRIPTION =
  'As provas oficiais do ENEM de 2022 a 2024, organizadas por ano e por caderno (Azul, Amarela, Branco e Rosa), com gabarito oficial e resolução comentada de cada questão.';

export const metadata: Metadata = {
  title: 'Provas do ENEM comentadas',
  description: DESCRIPTION,
  alternates: {
    canonical: '/provas',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: SITE_NAME,
    url: '/provas',
    title: 'Provas do ENEM comentadas',
    description: DESCRIPTION,
  },
};

interface FilterOption {
  value: string | null;
  label: string;
}

interface FilterGroupProps {
  label: string;
  options: FilterOption[];
  isActive: (value: string | null) => boolean;
  makeHref: (value: string | null) => string;
}

/** Grupo de filtros como links: sem client JS, tudo resolvido na query string. */
function FilterGroup({ label, options, isActive, makeHref }: FilterGroupProps) {
  return (
    <div
      className="filter-bar__group"
      role="group"
      aria-label={`Filtrar por ${label.toLowerCase()}`}
    >
      <span className="filter-bar__label">{label}</span>

      <div className="filter-bar__chips">
        {options.map((option) => {
          const active = isActive(option.value);
          // Clicar no filtro já ativo volta a limpá-lo (comportamento de toggle).
          const nextValue = active && option.value !== null ? null : option.value;

          return (
            <Link
              key={option.value ?? 'todos'}
              href={makeHref(nextValue)}
              className={active ? 'chip chip--active' : 'chip'}
              aria-pressed={active}
            >
              {option.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function disciplineName(id: string): string {
  return ENEM_DISCIPLINES.find((area) => area.id === id)?.name ?? id;
}

interface ProvasPageProps {
  searchParams: Promise<{ ano?: string; cor?: string; disciplina?: string }>;
}

export default async function ProvasPage({ searchParams }: ProvasPageProps) {
  const params = await searchParams;
  const filters = normalizeFilters(params);
  const user = await getSession();

  const results = filterExams(officialExams, questions, filters);
  const filtered = hasActiveFilters(filters);

  const yearOptions: FilterOption[] = [
    { value: null, label: 'Todos' },
    ...EXAM_YEARS.map((year) => ({ value: String(year), label: String(year) })),
  ];

  const colorOptions: FilterOption[] = [
    { value: null, label: 'Todas' },
    ...EXAM_BOOKLET_COLORS.map((color) => ({ value: color, label: color })),
  ];

  const areaOptions: FilterOption[] = [
    { value: null, label: 'Todas' },
    ...EXAM_DISCIPLINES.map((id) => ({ value: id, label: disciplineName(id) })),
  ];

  const countLabel = filtered
    ? `${results.length} de ${officialExams.length} provas`
    : `${results.length} provas no acervo`;

  return (
    <>
      <PublicHeader />

      <main id="conteudo">
        <section className="section">
          <div className="container">
            {/* -------------------------------------------------- Intro editorial */}
            <header className="page-hero">
              <span className="section-header__eyebrow">Acervo oficial</span>
              <h1 className="page-hero__title">Provas do ENEM comentadas</h1>
              <p className="page-hero__description">
                Doze cadernos oficiais de 2022 a 2024, organizados por ano e por cor, prontos para
                resolver no seu tempo.
              </p>
              <p className="editorial-note">
                Cada prova fica separada por ano e por caderno (Azul, Amarela, Branco e Rosa). Ao
                abrir uma prova você encontra as questões com o gabarito oficial e a resolução
                comentada passo a passo — sem cadastro para ler.
              </p>
            </header>

            {/* --------------------------------------------------------- Resultados */}
            <SectionHeader
              eyebrow="Catálogo"
              title="Escolha a prova que você quer resolver"
              description="Filtre por ano, por cor do caderno ou por área do conhecimento. Os filtros valem para a lista inteira."
              action={
                <span className="results-count" aria-live="polite">
                  {countLabel}
                </span>
              }
            />

            <div className="filter-bar">
              <FilterGroup
                label="Ano"
                options={yearOptions}
                isActive={(value) => (value === null ? !filters.ano : filters.ano === value)}
                makeHref={(value) => buildExamListHref(filters, { ano: value ?? undefined })}
              />

              <FilterGroup
                label="Cor"
                options={colorOptions}
                isActive={(value) => (value === null ? !filters.cor : filters.cor === value)}
                makeHref={(value) => buildExamListHref(filters, { cor: value ?? undefined })}
              />

              <FilterGroup
                label="Área"
                options={areaOptions}
                isActive={(value) =>
                  value === null ? !filters.disciplina : filters.disciplina === value
                }
                makeHref={(value) => buildExamListHref(filters, { disciplina: value ?? undefined })}
              />

              {filtered ? (
                <div className="filter-bar__active">
                  <span className="filter-bar__active-label">Filtros ativos:</span>

                  {filters.ano ? (
                    <Link
                      href={buildExamListHref(filters, { ano: undefined })}
                      className="chip chip--active"
                      aria-label={`Remover filtro de ano ${filters.ano}`}
                    >
                      Ano: {filters.ano}
                      <X size={14} aria-hidden="true" />
                    </Link>
                  ) : null}

                  {filters.cor ? (
                    <Link
                      href={buildExamListHref(filters, { cor: undefined })}
                      className="chip chip--active"
                      aria-label={`Remover filtro de cor ${filters.cor}`}
                    >
                      Cor: {filters.cor}
                      <X size={14} aria-hidden="true" />
                    </Link>
                  ) : null}

                  {filters.disciplina ? (
                    <Link
                      href={buildExamListHref(filters, { disciplina: undefined })}
                      className="chip chip--active"
                      aria-label={`Remover filtro de área ${disciplineName(filters.disciplina)}`}
                    >
                      Área: {disciplineName(filters.disciplina)}
                      <X size={14} aria-hidden="true" />
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </div>

            {results.length > 0 ? (
              <div className="grid-3">
                {results.map((exam) => (
                  <ExamCard
                    key={exam.id}
                    exam={exam}
                    questionCount={countExamQuestions(questions, exam)}
                    href={user ? `/app/provas/${exam.id}` : `/provas/${exam.id}`}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<SearchX size={32} />}
                title="Nenhuma prova com estes filtros"
                description="Nenhum caderno do acervo combina com a combinação de ano, cor e área escolhida. Limpe os filtros para ver as 12 provas oficiais."
                action={
                  <Button href="/provas" variant="primary">
                    Limpar filtros
                  </Button>
                }
              />
            )}
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}
