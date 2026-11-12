import Link from 'next/link';
import type { CSSProperties } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Compass,
  Globe,
  GraduationCap,
  Leaf,
  Target,
} from 'lucide-react';

import { PublicFooter } from '@/components/layout/PublicFooter';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { ExamCard } from '@/components/exams/ExamCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { officialExams, questions } from '@/data/catalog';
import { ENEM_DISCIPLINES } from '@/domain/constants';
import type { BookletColor, OfficialExam } from '@/domain/types';
import { countExamQuestions } from '@/lib/exams';

const AREA_ICONS = {
  matematica: Compass,
  natureza: Leaf,
  humanas: Globe,
  linguagens: BookOpen,
} as const;

/** Três cadernos em destaque na landing (ano + cor oficiais). */
const FEATURED_KEYS: Array<{ year: number; color: BookletColor }> = [
  { year: 2024, color: 'Azul' },
  { year: 2023, color: 'Amarela' },
  { year: 2022, color: 'Rosa' },
];

const STEPS = [
  {
    icon: ClipboardList,
    title: 'Escolha uma prova',
    description:
      'Doze cadernos oficiais de 2022 a 2024, organizados por ano e por cor, prontos para resolver no seu tempo.',
  },
  {
    icon: CheckCircle2,
    title: 'Responda e veja a resolução',
    description:
      'Marque a alternativa e confira na hora o gabarito oficial, com a resolução comentada passo a passo.',
  },
  {
    icon: Target,
    title: 'Acompanhe seu score',
    description:
      'Com conta gratuita, sua precisão por área fica salva e mostra exatamente onde estudar em seguida.',
  },
];

/** Prévia de desempenho estática do hero (números tabulares, sem interação). */
const PREVIEW_SCORES = [
  { label: 'Matemática', value: 32, max: 45, tone: 'positive' as const },
  { label: 'Ciências da Natureza', value: 28, max: 45, tone: 'default' as const },
  { label: 'Ciências Humanas', value: 35, max: 45, tone: 'positive' as const },
  { label: 'Linguagens', value: 30, max: 45, tone: 'default' as const },
];

function getFeaturedExams(): OfficialExam[] {
  const featured = FEATURED_KEYS.map(({ year, color }) =>
    officialExams.find((exam) => exam.year === year && exam.bookletColor === color),
  ).filter((exam): exam is OfficialExam => exam !== undefined);

  return featured.length > 0 ? featured : officialExams.slice(0, 3);
}

export default function Home() {
  const featuredExams = getFeaturedExams();

  return (
    <>
      <PublicHeader />
      <main id="conteudo">
        {/* ---------------------------------------------------------- Hero */}
        <section className="hero">
          <div className="container">
            <div className="hero__inner">
              <div>
                <span className="hero__eyebrow">
                  <GraduationCap size={14} aria-hidden="true" />
                  ENEM 2026 · estudo guiado
                </span>

                <h1 className="hero__title">
                  Resolva as provas oficiais do ENEM e descubra onde você perde ponto.
                </h1>

                <p className="hero__subtitle">
                  Doze cadernos de 2022 a 2024 com gabarito comentado, teoria das quatro áreas e
                  um score por matéria — sem enrolação e sem pagar nada para começar.
                </p>

                <div className="hero__actions">
                  <Button href="/provas">
                    Ver provas
                    <ArrowRight size={16} aria-hidden="true" />
                  </Button>
                  <Button href="/criar-conta" variant="secondary">
                    Criar conta
                  </Button>
                </div>

                <p className="hero__note">
                  Sem cadastro para ler. Com conta para salvar seu score.
                </p>
              </div>

              <aside className="hero__aside" aria-label="Prévia de desempenho">
                <Card>
                  <span className="section-header__eyebrow">Prévia de desempenho</span>

                  <div className="row" style={{ justifyContent: 'space-between' }}>
                    <span className="metric__value tabular">612</span>
                    <Badge tone="primary">Exemplo</Badge>
                  </div>
                  <p className="meta">pontos em um simulado de demonstração</p>

                  <div className="stack" style={{ marginTop: 'var(--space-md)' }}>
                    {PREVIEW_SCORES.map((score) => (
                      <ProgressBar
                        key={score.label}
                        label={score.label}
                        value={score.value}
                        max={score.max}
                        valueText={`${score.value}/${score.max}`}
                        tone={score.tone}
                      />
                    ))}
                  </div>

                  <p className="meta" style={{ marginTop: 'var(--space-md)' }}>
                    Crie sua conta para acompanhar o seu score real.
                  </p>
                </Card>
              </aside>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ Métricas */}
        <section className="section" aria-label="Números do acervo">
          <div className="container">
            <div className="grid-4">
              <div className="metric">
                <span className="metric__value">{officialExams.length}</span>
                <span className="metric__label">provas oficiais do ENEM</span>
              </div>
              <div className="metric">
                <span className="metric__value">{questions.length}</span>
                <span className="metric__label">questões com resolução comentada</span>
              </div>
              <div className="metric">
                <span className="metric__value">{ENEM_DISCIPLINES.length}</span>
                <span className="metric__label">áreas do conhecimento</span>
              </div>
              <div className="metric">
                <span className="metric__value">100%</span>
                <span className="metric__label">gratuito, sem plano pago</span>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ Como funciona */}
        <section className="section section--tonal" id="como-funciona">
          <div className="container">
            <SectionHeader
              eyebrow="Como funciona"
              title="Do caderno oficial ao seu score em três passos"
              description="Sem cadastro obrigatório para ler: você escolhe a prova, resolve no seu tempo e confere a resolução."
            />

            <div className="grid-3">
              {STEPS.map((step, index) => {
                const Icon = step.icon;

                return (
                  <article key={step.title} className="step">
                    <div className="row" style={{ justifyContent: 'space-between' }}>
                      <span className="step__number">{index + 1}</span>
                      <Icon size={20} aria-hidden="true" style={{ color: 'var(--primary)' }} />
                    </div>
                    <h3 className="step__title">{step.title}</h3>
                    <p className="step__description">{step.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* --------------------------------------------- Provas em destaque */}
        <section className="section" id="provas-destaque">
          <div className="container">
            <SectionHeader
              eyebrow="Provas em destaque"
              title="Comece por um caderno oficial"
              description="Os cadernos mais recentes do ENEM, com as questões das quatro áreas já separadas por caderno."
              action={
                <Button href="/provas" variant="ghost" size="sm">
                  Ver todas as provas
                  <ArrowRight size={16} aria-hidden="true" />
                </Button>
              }
            />

            <div className="grid-3">
              {featuredExams.map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  questionCount={countExamQuestions(questions, exam)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- Áreas do ENEM */}
        <section className="section section--tonal" id="areas">
          <div className="container">
            <SectionHeader
              eyebrow="Áreas do conhecimento"
              title="As quatro grandes áreas, com teoria e questões"
              description="Cada área tem resumo próprio, pegadinhas clássicas e as questões do catálogo local."
            />

            <div className="grid-4">
              {ENEM_DISCIPLINES.map((area) => {
                const Icon = AREA_ICONS[area.id];

                return (
                  <Link
                    key={area.id}
                    href={`/provas?disciplina=${area.id}`}
                    className="area-card"
                    style={
                      {
                        '--area-accent': area.accent,
                        '--area-tint': area.tint,
                      } as CSSProperties
                    }
                  >
                    <span className="area-card__icon">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span className="area-card__code">{area.code}</span>
                    <h3 className="area-card__title">{area.name}</h3>
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
                      Ver questões
                      <ArrowRight size={14} aria-hidden="true" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- CTA final */}
        <section className="section">
          <div className="container">
            <div className="cta-panel">
              <div>
                <h2>Pronto para transformar o medo das questões oficiais em plano de estudo?</h2>
                <p style={{ marginTop: 'var(--space-sm)' }}>
                  Crie sua conta grátis para salvar o score de cada prova e descobrir qual área
                  pede mais atenção em seguida.
                </p>
              </div>

              <div className="row">
                <Button href="/criar-conta">
                  Criar conta
                  <ArrowRight size={16} aria-hidden="true" />
                </Button>
                <Button href="/provas" variant="secondary">
                  Ver provas
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}
