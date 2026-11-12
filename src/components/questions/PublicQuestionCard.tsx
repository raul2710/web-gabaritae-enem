/* eslint-disable @next/next/no-img-element -- o dataset traz gráficos SVG em Data URI,
   que o next/image não otimiza. */
import { Badge } from '@/components/ui/Badge';
import type { Alternative, Question } from '@/domain/types';

const LETTERS = ['A', 'B', 'C', 'D', 'E'] as const;

function buildAlternatives(question: Question): Alternative[] {
  return question.alternatives.map((text, index) => ({
    letter: LETTERS[index] ?? 'A',
    text,
  }));
}

interface PublicQuestionCardProps {
  question: Question;
}

/** Questão comentada em modo somente leitura (sem estado de resposta). */
export function PublicQuestionCard({ question }: PublicQuestionCardProps) {
  const alternatives = buildAlternatives(question);

  return (
    <article className="question-card">
      <div className="question-card__header">
        <Badge tone="primary">{question.year}</Badge>
        <Badge>{question.subject}</Badge>
        <Badge>{question.difficulty}</Badge>
        <Badge tone={question.bookletColor.toLowerCase() as 'azul' | 'amarela' | 'branca' | 'rosa'}>
          Caderno {question.bookletColor}
        </Badge>
      </div>

      <p className="question-card__statement">{question.title}</p>

      {question.imageUrl ? (
        <figure className="question-card__figure">
          <img src={question.imageUrl} alt={`Ilustração da questão sobre ${question.topic}`} />
        </figure>
      ) : null}

      <ol className="alternatives">
        {alternatives.map((alternative) => (
          <li
            key={alternative.letter}
            className={[
              'alternative',
              'alternative--static',
              alternative.letter === question.correctAlternative ? 'alternative--correct' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className="alternative__letter" aria-hidden="true">
              {alternative.letter}
            </span>
            <span>{alternative.text}</span>
          </li>
        ))}
      </ol>

      <details className="question-card__answer">
        <summary>Ver gabarito e resolução</summary>

        <p className="answer-key">
          Gabarito oficial: <strong>{question.correctAlternative}</strong>
        </p>
        <p className="answer-explanation">{question.explanation}</p>
      </details>
    </article>
  );
}
