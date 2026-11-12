import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PlayCircle, SearchX } from 'lucide-react';

import { bookletTone } from '@/components/exams/ExamCard';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicQuestionCard } from '@/components/questions/PublicQuestionCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { officialExams } from '@/data/catalog';
import { ENEM_DISCIPLINES } from '@/domain/constants';
import type { OfficialExam, Question } from '@/domain/types';
import { getAllExams, getExamQuestions } from '@/lib/api';
import { deriveExamFromId, findExam } from '@/lib/exams';

const SITE_NAME = 'Gabaritaê ENEM';

interface ExamPageProps {
  params: Promise<{ examId: string }>;
}

/** Novos ids (provas que só existem na API) são renderizados sob demanda. */
export const dynamicParams = true;

export function generateStaticParams() {
  return officialExams.map((exam) => ({ examId: exam.id }));
}

export async function generateMetadata({ params }: ExamPageProps): Promise<Metadata> {
  const { examId } = await params;

  // Metadados só com dados locais: a página nunca espera pela API por causa do SEO.
  const exam = findExam(officialExams, examId) ?? deriveExamFromId(examId);

  if (!exam) {
    return { title: 'Prova não encontrada', robots: { index: false } };
  }

  const title = `${exam.title} — questões comentadas`;
  const description = `${exam.subtitle} Gabarito oficial e resolução comentada de cada questão, sem cadastro para ler.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/provas/${examId}`,
    },
    openGraph: {
      type: 'article',
      locale: 'pt_BR',
      siteName: SITE_NAME,
      url: `/provas/${examId}`,
      title,
      description,
    },
  };
}

export default async function ExamPage({ params }: ExamPageProps) {
  const { examId } = await params;

  const examList = await getAllExams();
  let exam = findExam(examList, examId) ?? findExam(officialExams, examId);
  let questions: Question[] = [];

  if (exam) {
    questions = await getExamQuestions(examId);
  } else {
    // A prova não está em nenhuma lista: só renderiza se a API trouxer
    // questões para um id no padrão `prova-<ano>-<cor>`.
    const derived = deriveExamFromId(examId);
    if (!derived) notFound();

    const candidate = await getExamQuestions(examId);
    questions = candidate.filter(
      (question) =>
        question.year === derived.year && question.bookletColor === derived.bookletColor,
    );

    if (questions.length === 0) notFound();

    exam = derived;
  }

  const activeExam: OfficialExam = exam;
  const activeAreas = ENEM_DISCIPLINES.filter((area) =>
    questions.some((question) => question.discipline === area.id),
  );
  const areasLabel =
    activeAreas.length > 0 ? activeAreas.map((area) => area.name).join(', ') : 'Não informada';
  const isSample = questions.length < 10;
  const startHref = `/app/provas/${activeExam.id}`;
  const breadcrumbLabel = `ENEM ${activeExam.year} — Caderno ${activeExam.bookletColor}`;

  return (
    <>
      <PublicHeader />

      <main id="conteudo" className="exam-detail">
        <div className="container">
          <nav className="breadcrumb" aria-label="Trilha de navegação">
            <Link href="/">Início</Link>
            <span className="breadcrumb__sep" aria-hidden="true">
              /
            </span>
            <Link href="/provas">Provas</Link>
            <span className="breadcrumb__sep" aria-hidden="true">
              /
            </span>
            <span aria-current="page">{breadcrumbLabel}</span>
          </nav>

          <header className="exam-detail__header">
            <div className="row">
              <Badge tone="primary">{activeExam.year}</Badge>
              <Badge tone={bookletTone(activeExam.bookletColor)}>
                Caderno {activeExam.bookletColor}
              </Badge>
              <Badge>
                {questions.length} {questions.length === 1 ? 'questão' : 'questões'}
              </Badge>
            </div>

            <h1 className="exam-detail__title">{activeExam.title}</h1>
            <p className="exam-detail__subtitle">{activeExam.subtitle}</p>

            {isSample ? (
              <p className="banner banner--warning">
                Esta é uma amostra comentada. Provas completas podem ser carregadas pela API.
              </p>
            ) : null}

            <div className="exam-detail__actions">
              <Button href={startHref}>
                <PlayCircle size={16} aria-hidden="true" />
                Fazer esta prova e salvar meu score
              </Button>
              <Button href={`/criar-conta?next=${startHref}`} variant="ghost">
                Criar conta
              </Button>
            </div>
          </header>

          <div className="exam-detail__grid">
            <div className="exam-detail__main">
              <SectionHeader
                eyebrow="Questões"
                title="Resolução comentada"
                description="Abra o gabarito de cada questão para conferir o passo a passo da resolução."
              />

              {questions.length > 0 ? (
                <div className="exam-detail__questions">
                  {questions.map((question) => (
                    <PublicQuestionCard key={question.id} question={question} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<SearchX size={32} />}
                  title="Nenhuma questão publicada ainda"
                  description="Esta prova está no catálogo, mas ainda não tem questões comentadas disponíveis. Enquanto isso, escolha outra prova do acervo."
                  action={
                    <Button href="/provas" variant="primary">
                      Ver todas as provas
                    </Button>
                  }
                />
              )}
            </div>

            <aside className="exam-detail__aside" aria-label="Resumo da prova">
              <span className="section-header__eyebrow">Resumo da prova</span>

              <dl className="exam-summary">
                <div>
                  <dt>Ano</dt>
                  <dd>{activeExam.year}</dd>
                </div>
                <div>
                  <dt>Caderno</dt>
                  <dd>{activeExam.bookletColor}</dd>
                </div>
                <div>
                  <dt>Área</dt>
                  <dd>{areasLabel}</dd>
                </div>
                <div>
                  <dt>Questões</dt>
                  <dd>{questions.length}</dd>
                </div>
              </dl>

              <Button href={startHref} block>
                Fazer esta prova
              </Button>
              <Button href="/provas" variant="ghost" block>
                Ver todas as provas
              </Button>
            </aside>
          </div>
        </div>
      </main>

      <PublicFooter />
    </>
  );
}
