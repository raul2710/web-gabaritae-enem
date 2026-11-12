import { describe, expect, it } from 'vitest';

import { officialExams, questions } from '@/data/catalog';
import type { BookletColor, DisciplineId, OfficialExam, Question } from '@/domain/types';
import {
  buildExamListHref,
  countExamQuestions,
  deriveExamFromId,
  filterExams,
  hasActiveFilters,
  normalizeFilters,
} from '@/lib/exams';

function makeExam(id: string, year: number, bookletColor: BookletColor): OfficialExam {
  return { id, year, bookletColor, title: id, subtitle: id };
}

function makeQuestion(
  year: number,
  bookletColor: BookletColor,
  discipline: DisciplineId,
): Question {
  return {
    id: `${year}-${bookletColor}-${discipline}`,
    year,
    bookletColor,
    discipline,
    subject: 'Matemática',
    difficulty: 'Médio',
    topic: 'Tópico',
    title: 'Enunciado de teste',
    alternatives: ['a', 'b', 'c', 'd', 'e'],
    correctAlternative: 'A',
    explanation: 'Resolução.',
  };
}

const EXAMS: OfficialExam[] = [
  makeExam('prova-2024-azul', 2024, 'Azul'),
  makeExam('prova-2024-rosa', 2024, 'Rosa'),
  makeExam('prova-2023-azul', 2023, 'Azul'),
];

const EXAM_QUESTIONS: Question[] = [
  makeQuestion(2024, 'Azul', 'matematica'),
  makeQuestion(2024, 'Azul', 'natureza'),
  makeQuestion(2024, 'Rosa', 'natureza'),
  makeQuestion(2023, 'Azul', 'humanas'),
];

describe('normalizeFilters', () => {
  it('mantém apenas os valores aceitos pelo catálogo', () => {
    expect(normalizeFilters({ ano: '2024', cor: 'Azul', disciplina: 'matematica' })).toEqual({
      ano: '2024',
      cor: 'Azul',
      disciplina: 'matematica',
    });
  });

  it('descarta valores fora do catálogo em vez de filtrar errado', () => {
    expect(normalizeFilters({ ano: '2019', cor: 'Verde', disciplina: 'historia' })).toEqual({});
    expect(normalizeFilters(undefined)).toEqual({});
  });
});

describe('buildExamListHref', () => {
  it('preserva os demais parâmetros ao alterar um filtro', () => {
    expect(buildExamListHref({ ano: '2024', cor: 'Azul' }, { cor: 'Rosa' })).toBe(
      '/provas?ano=2024&cor=Rosa',
    );
    expect(buildExamListHref({ ano: '2024' }, { disciplina: 'matematica' })).toBe(
      '/provas?ano=2024&disciplina=matematica',
    );
  });

  it('remove o parâmetro limpo e volta para /provas quando não sobra filtro', () => {
    expect(buildExamListHref({ ano: '2024', disciplina: 'natureza' }, { ano: undefined })).toBe(
      '/provas?disciplina=natureza',
    );
    expect(
      buildExamListHref({ ano: '2024', cor: 'Azul' }, { ano: undefined, cor: undefined }),
    ).toBe('/provas');
    expect(buildExamListHref({})).toBe('/provas');
  });
});

describe('hasActiveFilters', () => {
  it('só considera ativo quando existe ao menos um filtro', () => {
    expect(hasActiveFilters({})).toBe(false);
    expect(hasActiveFilters({ disciplina: 'humanas' })).toBe(true);
    expect(hasActiveFilters({ ano: '2023' })).toBe(true);
  });
});

describe('filterExams', () => {
  it('filtra por ano e por cor do caderno', () => {
    expect(filterExams(EXAMS, EXAM_QUESTIONS, { ano: '2024' }).map((e) => e.id)).toEqual([
      'prova-2024-azul',
      'prova-2024-rosa',
    ]);
    expect(filterExams(EXAMS, EXAM_QUESTIONS, { cor: 'Azul' }).map((e) => e.id)).toEqual([
      'prova-2024-azul',
      'prova-2023-azul',
    ]);
  });

  it('mantém apenas provas com ao menos uma questão da área', () => {
    expect(
      filterExams(EXAMS, EXAM_QUESTIONS, { disciplina: 'matematica' }).map((e) => e.id),
    ).toEqual(['prova-2024-azul']);
    expect(filterExams(EXAMS, EXAM_QUESTIONS, { disciplina: 'linguagens' })).toEqual([]);
  });

  it('combina os filtros com E lógico', () => {
    expect(
      filterExams(EXAMS, EXAM_QUESTIONS, { ano: '2024', cor: 'Azul', disciplina: 'natureza' }),
    ).toHaveLength(1);
    expect(
      filterExams(EXAMS, EXAM_QUESTIONS, { ano: '2024', cor: 'Azul', disciplina: 'humanas' }),
    ).toEqual([]);
    expect(filterExams(EXAMS, EXAM_QUESTIONS, { ano: '2021' })).toEqual([]);
  });

  it('no catálogo real, todo ano e toda área devolvem provas', () => {
    expect(filterExams(officialExams, questions, { ano: '2024' })).toHaveLength(4);
    expect(
      filterExams(officialExams, questions, { disciplina: 'matematica' }).length,
    ).toBeGreaterThan(0);
  });
});

describe('countExamQuestions', () => {
  it('conta só as questões do ano + caderno da prova', () => {
    const exam = makeExam('prova-2024-azul', 2024, 'Azul');

    expect(countExamQuestions(EXAM_QUESTIONS, exam)).toBe(2);
    expect(countExamQuestions([], exam)).toBe(0);
  });

  it('no catálogo real, toda questão pertence a exatamente uma prova', () => {
    const total = officialExams.reduce((sum, exam) => sum + countExamQuestions(questions, exam), 0);

    expect(total).toBe(questions.length);
  });
});

describe('deriveExamFromId', () => {
  it('deriva ano e caderno de um id no padrão prova-<ano>-<cor>', () => {
    const derived = deriveExamFromId('prova-2021-rosa');

    expect(derived).not.toBeNull();
    expect(derived?.id).toBe('prova-2021-rosa');
    expect(derived?.year).toBe(2021);
    expect(derived?.bookletColor).toBe('Rosa');
    expect(derived?.title).toContain('2021');
  });

  it('devolve null para ids fora do padrão (a página responde 404)', () => {
    expect(deriveExamFromId('enem-2024-mt-136')).toBeNull();
    expect(deriveExamFromId('prova-2024-verde')).toBeNull();
    expect(deriveExamFromId('qualquer-coisa')).toBeNull();
  });
});
