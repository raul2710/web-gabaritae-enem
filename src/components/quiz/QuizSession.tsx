'use client';

import { ArrowLeft, ClipboardList, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { QuestionCardInteractive } from '@/components/questions/QuestionCardInteractive';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import type { AlternativeLetter, Question, SessionUser } from '@/domain/types';
import { useAttemptsStore } from '@/stores/useAttemptsStore';

interface QuizAnswer {
  question: Question;
  selected: AlternativeLetter;
  isCorrect: boolean;
}

interface QuizSessionProps {
  title: string;
  subtitle?: string;
  questions: Question[];
  user: SessionUser;
  /** Destino do link de sair (também usado no "Voltar"). */
  backHref: string;
  backLabel?: string;
  /** Contexto curto ao lado do link de sair (ex.: nº de questões). */
  contextLabel?: string;
}

interface PerformanceBadge {
  label: string;
  tone: BadgeTone;
  ringClass: string;
}

/** Selo de desempenho do resultado: >=80 excelente, >=60 bom, abaixo revisar. */
function performanceBadge(score: number): PerformanceBadge {
  if (score >= 80) return { label: 'Excelente', tone: 'positive', ringClass: 'score-ring--positive' };
  if (score >= 60) return { label: 'Bom', tone: 'primary', ringClass: '' };
  return { label: 'Revisar', tone: 'warning', ringClass: 'score-ring--warning' };
}

/**
 * Sessão de resolução de prova reutilizável (provas do acervo, simulados,
 * revisões): navega questão a questão, revela o gabarito, grava cada tentativa
 * no store do usuário e fecha com tela de score + revisão.
 */
export function QuizSession({
  title,
  subtitle,
  questions,
  user,
  backHref,
  backLabel = 'Voltar',
  contextLabel,
}: QuizSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<AlternativeLetter | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [finished, setFinished] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);
  const recordAttempt = useAttemptsStore((state) => state.recordAttempt);

  const total = questions.length;
  const current = questions[currentIndex];
  const isLast = currentIndex === total - 1;
  const answered = answers.length;
  const progressPercent = total > 0 ? Math.round((answered / total) * 100) : 0;

  const correctCount = answers.filter((answer) => answer.isCorrect).length;
  const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const badge = performanceBadge(score);

  useEffect(() => {
    if (finished) resultRef.current?.focus();
  }, [finished]);

  function handleConfirm() {
    if (!current || selected === null || revealed) return;

    const isCorrect = selected === current.correctAlternative;

    recordAttempt(user.id, {
      questionId: current.id,
      discipline: current.discipline,
      year: current.year,
      selectedAlternative: selected,
      correctAlternative: current.correctAlternative,
      isCorrect,
      timestamp: new Date().toISOString(),
    });

    setAnswers((prev) => {
      const entry: QuizAnswer = { question: current, selected, isCorrect };
      const index = prev.findIndex((item) => item.question.id === current.id);
      if (index === -1) return [...prev, entry];

      const next = [...prev];
      next[index] = entry;
      return next;
    });

    setRevealed(true);
  }

  function handleNext() {
    if (isLast) {
      setFinished(true);
      return;
    }

    setCurrentIndex((index) => index + 1);
    setSelected(null);
    setRevealed(false);
  }

  function handleReset() {
    setCurrentIndex(0);
    setSelected(null);
    setRevealed(false);
    setAnswers([]);
    setFinished(false);
  }

  if (total === 0) {
    return (
      <section className="section">
        <EmptyState
          icon={<ClipboardList size={32} />}
          title="Nenhuma questão disponível"
          description="Esta prova ainda não tem questões para responder. Escolha outra prova do acervo para começar e salvar seu score."
          action={<Button href="/app/provas">Escolher uma prova</Button>}
        />
      </section>
    );
  }

  return (
    <section className="section">
      <header className="quiz-header">
        <div className="quiz-header__top">
          <Button href={backHref} variant="ghost" size="sm">
            <ArrowLeft size={16} aria-hidden="true" />
            {backLabel}
          </Button>
          {contextLabel ? <span className="quiz-header__context">{contextLabel}</span> : null}
        </div>

        <div className="quiz-header__main">
          <div className="quiz-header__text">
            <h1 className="quiz-header__title">{title}</h1>
            {subtitle ? <p className="quiz-header__subtitle">{subtitle}</p> : null}
          </div>
          <span className="quiz-header__count">
            {finished ? 'Prova concluída' : `${currentIndex + 1} de ${total}`}
          </span>
        </div>

        <div
          className="quiz-progress"
          role="progressbar"
          aria-label="Progresso da prova"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={answered}
        >
          <div className="quiz-progress__bar" style={{ width: `${progressPercent}%` }} />
        </div>
      </header>

      <div className="quiz-body">
        {finished ? (
          <div className="quiz-result" ref={resultRef} tabIndex={-1}>
            <div className={['score-ring', badge.ringClass].filter(Boolean).join(' ')} aria-hidden="true">
              <span className="score-ring__value">{score}%</span>
              <span className="score-ring__caption">de aproveitamento</span>
            </div>

            <div className="quiz-result__heading">
              <h2>Resultado da prova</h2>
              <Badge tone={badge.tone}>{badge.label}</Badge>
            </div>

            <p className="quiz-result__summary">
              <strong>{correctCount}</strong> de <strong>{total}</strong>{' '}
              {total === 1 ? 'questão correta' : 'questões corretas'}
            </p>

            <div className="quiz-result__actions">
              <Button onClick={handleReset}>
                <RotateCcw size={16} aria-hidden="true" />
                Refazer prova
              </Button>
              <Button href="/app" variant="secondary">
                Voltar ao painel
              </Button>
              <Button href="/app/provas" variant="ghost">
                Ver outra prova
              </Button>
            </div>

            <div className="quiz-result__review">
              <h3>Revisão das questões</h3>
              <ol className="review-list">
                {answers.map((answer, index) => (
                  <li key={answer.question.id} className="review-item">
                    <div className="review-item__head">
                      <span className="review-item__index" aria-hidden="true">
                        {index + 1}
                      </span>
                      <span className="review-item__subject">{answer.question.subject}</span>
                      <Badge tone={answer.isCorrect ? 'positive' : 'negative'}>
                        {answer.isCorrect ? 'Acerto' : 'Erro'}
                      </Badge>
                    </div>

                    <p className="review-item__statement">{answer.question.title}</p>

                    <p className="review-item__answers">
                      Sua resposta: <strong>{answer.selected}</strong> · Gabarito:{' '}
                      <strong>{answer.question.correctAlternative}</strong>
                    </p>

                    <details className="review-item__detail">
                      <summary>Ver explicação</summary>
                      <p className="answer-explanation">{answer.question.explanation}</p>
                    </details>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : current ? (
          <QuestionCardInteractive
            question={current}
            selected={selected}
            revealed={revealed}
            onSelect={setSelected}
            onConfirm={handleConfirm}
            isLast={isLast}
            onNext={handleNext}
          />
        ) : null}
      </div>
    </section>
  );
}
