/* eslint-disable @next/next/no-img-element -- o dataset traz gráficos SVG em Data URI,
   que o next/image não otimiza. */
'use client';

import { useEffect, useRef } from 'react';

import { bookletTone } from '@/components/exams/ExamCard';
import { Badge } from '@/components/ui/Badge';
import type { AlternativeLetter, Question } from '@/domain/types';

const LETTERS: AlternativeLetter[] = ['A', 'B', 'C', 'D', 'E'];

interface QuestionCardInteractiveProps {
  question: Question;
  selected: AlternativeLetter | null;
  revealed: boolean;
  onSelect: (letter: AlternativeLetter) => void;
  onConfirm: () => void;
  /** Última questão da sessão: o botão principal vira "Ver resultado". */
  isLast?: boolean;
  onNext?: () => void;
}

/**
 * Questão interativa usada na resolução de provas.
 *
 * Sem estado de tentativa: o componente só emite eventos (`onSelect`,
 * `onConfirm`, `onNext`) e o pai (`QuizSession`) calcula o acerto e grava a
 * tentativa — assim o mesmo cartão serve para provas, simulados e revisão.
 */
export function QuestionCardInteractive({
  question,
  selected,
  revealed,
  onSelect,
  onConfirm,
  isLast = false,
  onNext,
}: QuestionCardInteractiveProps) {
  const cardRef = useRef<HTMLElement>(null);
  const actionRef = useRef<HTMLButtonElement>(null);
  const wasRevealedRef = useRef(revealed);

  const isCorrect = revealed && selected !== null && selected === question.correctAlternative;

  /**
   * Após confirmar, o foco vai para o botão de próxima questão (o elemento
   * anterior é desmontado ao revelar). Ao avançar, o foco volta para o
   * cartão, de onde o usuário segue pelas alternativas com o teclado.
   */
  useEffect(() => {
    if (revealed) {
      actionRef.current?.focus();
    } else if (wasRevealedRef.current) {
      cardRef.current?.focus();
    }

    wasRevealedRef.current = revealed;
  }, [revealed, question.id]);

  return (
    <article
      ref={cardRef}
      tabIndex={-1}
      className="question-card"
      aria-label={`Questão de ${question.subject}`}
    >
      <div className="question-card__header">
        <Badge tone="primary">{question.year}</Badge>
        <Badge>{question.subject}</Badge>
        <Badge>{question.difficulty}</Badge>
        <Badge tone={bookletTone(question.bookletColor)}>Caderno {question.bookletColor}</Badge>
      </div>

      <p className="question-card__statement">{question.title}</p>

      {question.imageUrl ? (
        <figure className="question-card__figure">
          <img src={question.imageUrl} alt={`Ilustração da questão sobre ${question.topic}`} />
        </figure>
      ) : null}

      <ol className="alternatives">
        {LETTERS.map((letter, index) => {
          const text = question.alternatives[index];
          if (!text) return null;

          const isChosen = selected === letter;
          const showCorrect = revealed && letter === question.correctAlternative;
          const showWrong = revealed && isChosen && letter !== question.correctAlternative;

          return (
            <li key={letter}>
              <button
                type="button"
                className={[
                  'alternative',
                  showCorrect ? 'alternative--correct' : '',
                  showWrong ? 'alternative--wrong' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-label={`Alternativa ${letter}: ${text}`}
                aria-pressed={isChosen}
                onClick={() => onSelect(letter)}
                disabled={revealed}
              >
                <span className="alternative__letter" aria-hidden="true">
                  {letter}
                </span>
                <span>{text}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {revealed ? (
        <div className="quiz-feedback" role="status" aria-live="polite">
          {isCorrect ? (
            <p className="quiz-feedback__result quiz-feedback__result--correct">Você acertou</p>
          ) : (
            <p className="quiz-feedback__result quiz-feedback__result--wrong">
              Resposta correta: <strong>{question.correctAlternative}</strong>
            </p>
          )}
          <p className="answer-explanation">{question.explanation}</p>
        </div>
      ) : null}

      <div className="question-card__actions">
        {!revealed ? (
          <button
            ref={actionRef}
            type="button"
            className="btn btn--primary"
            onClick={onConfirm}
            disabled={selected === null}
          >
            Confirmar resposta
          </button>
        ) : (
          <button ref={actionRef} type="button" className="btn btn--primary" onClick={onNext}>
            {isLast ? 'Ver resultado' : 'Próxima questão'}
          </button>
        )}
      </div>
    </article>
  );
}
