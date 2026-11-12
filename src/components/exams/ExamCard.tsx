import Link from 'next/link';
import { ArrowRight, ListChecks } from 'lucide-react';

import { Badge, type BadgeTone } from '@/components/ui/Badge';
import type { OfficialExam } from '@/domain/types';

/** Tom do badge de caderno; cores fora do padrão caem em `neutral`. */
export function bookletTone(color: string): BadgeTone {
  const tone = String(color ?? '').toLowerCase();

  if (tone === 'azul' || tone === 'amarela' || tone === 'branca' || tone === 'rosa') return tone;

  return 'neutral';
}

interface ExamCardProps {
  exam: OfficialExam;
  questionCount: number;
  /** Padrão: `/provas/[examId]`. */
  href?: string;
}

/** Card editorial de prova oficial, usado no catálogo e na landing. */
export function ExamCard({ exam, questionCount, href }: ExamCardProps) {
  const target = href ?? `/provas/${exam.id}`;

  return (
    <Link href={target} className="exam-card" aria-label={`Abrir prova: ${exam.title}`}>
      <div className="exam-card__top">
        <Badge tone="primary">{exam.year}</Badge>
        <Badge tone={bookletTone(exam.bookletColor)}>Caderno {exam.bookletColor}</Badge>
      </div>

      <span className="exam-card__title">{exam.title}</span>
      <span className="exam-card__subtitle">{exam.subtitle}</span>

      <div className="exam-card__footer">
        <span className="row">
          <ListChecks size={14} aria-hidden="true" />
          {questionCount} {questionCount === 1 ? 'questão' : 'questões'}
        </span>
        <span className="exam-card__cta">
          Abrir prova
          <ArrowRight size={14} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
