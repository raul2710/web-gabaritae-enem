import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { SearchX } from 'lucide-react';

import { QuizSession } from '@/components/quiz/QuizSession';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { officialExams } from '@/data/catalog';
import type { Question } from '@/domain/types';
import { getAllExams, getExamQuestions } from '@/lib/api';
import { getSession } from '@/lib/auth';
import { deriveExamFromId, findExam } from '@/lib/exams';

interface AppExamPageProps {
  params: Promise<{ examId: string }>;
}

/**
 * Modo de resolução de uma prova oficial dentro da área do aluno.
 * Dinâmica por causa do cookie de sessão; nunca indexada.
 */
export async function generateMetadata({ params }: AppExamPageProps): Promise<Metadata> {
  const { examId } = await params;

  // Metadados só com dados locais: a página nunca espera pela API.
  const exam = findExam(officialExams, examId) ?? deriveExamFromId(examId);
  if (!exam) {
    return { title: 'Prova não encontrada', robots: { index: false } };
  }

  return {
    title: `${exam.title} · Resolver prova`,
    robots: { index: false },
  };
}

export default async function AppExamPage({ params }: AppExamPageProps) {
  const { examId } = await params;

  // O layout já protege as rotas `/app/*`; revalida aqui por segurança.
  const user = await getSession();
  if (!user) {
    redirect(`/entrar?next=${encodeURIComponent(`/app/provas/${examId}`)}`);
  }

  const examList = await getAllExams();
  let exam = findExam(examList, examId) ?? findExam(officialExams, examId);
  let questions: Question[] = [];

  if (exam) {
    questions = await getExamQuestions(examId);
  } else {
    // Prova fora do catálogo local: só renderiza se o id for derivável.
    const derived = deriveExamFromId(examId);
    if (!derived) notFound();

    const candidate = await getExamQuestions(examId);
    questions = candidate.filter(
      (question) =>
        question.year === derived.year && question.bookletColor === derived.bookletColor,
    );
    exam = derived;
  }

  if (!exam) notFound();

  if (questions.length === 0) {
    return (
      <section className="section">
        <EmptyState
          icon={<SearchX size={32} />}
          title="Esta prova ainda não tem questões"
          description="O caderno está no catálogo, mas nenhuma questão está disponível para resolução agora. Você pode ver a resolução comentada na página pública ou escolher outra prova."
          action={
            <div className="row">
              <Button href={`/provas/${exam.id}`}>Ver resolução comentada</Button>
              <Button href="/app/provas" variant="secondary">
                Voltar às provas
              </Button>
            </div>
          }
        />
      </section>
    );
  }

  return (
    <QuizSession
      title={exam.title}
      subtitle={exam.subtitle}
      questions={questions}
      user={user}
      backHref="/app/provas"
      backLabel="Provas"
      contextLabel={`${questions.length} ${questions.length === 1 ? 'questão' : 'questões'}`}
    />
  );
}
