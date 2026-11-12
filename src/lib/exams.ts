import type { BookletColor, DisciplineId, OfficialExam, Question } from '@/domain/types';

/**
 * Helpers puros de prova: filtros server-side de `/provas`, contagem de
 * questões por caderno e derivação de prova a partir do id.
 * Nenhum acesso à rede — os dados entram como argumento.
 */

/** Parâmetros aceitos pela página `/provas` (query string, lida no servidor). */
export interface ExamFilters {
  ano?: string;
  cor?: string;
  disciplina?: string;
}

/** Anos disponíveis no catálogo, em ordem decrescente. */
export const EXAM_YEARS = [2024, 2023, 2022] as const;

/** Cadernos oficiais do ENEM, na ordem usada pelos filtros. */
export const EXAM_BOOKLET_COLORS: BookletColor[] = ['Azul', 'Amarela', 'Branca', 'Rosa'];

/** Áreas aceitas no filtro `disciplina`. */
export const EXAM_DISCIPLINES: DisciplineId[] = ['matematica', 'natureza', 'humanas', 'linguagens'];

/**
 * Valida a query string: valores fora do catálogo são descartados em vez de
 * gerar uma URL inválida ou um resultado enganoso.
 */
export function normalizeFilters(raw: ExamFilters | undefined): ExamFilters {
  const source = raw ?? {};
  const filters: ExamFilters = {};

  const ano = source.ano;
  if (ano && EXAM_YEARS.some((year) => String(year) === ano)) {
    filters.ano = ano;
  }

  const cor = source.cor;
  if (cor && EXAM_BOOKLET_COLORS.includes(cor as BookletColor)) {
    filters.cor = cor;
  }

  const disciplina = source.disciplina;
  if (disciplina && EXAM_DISCIPLINES.includes(disciplina as DisciplineId)) {
    filters.disciplina = disciplina;
  }

  return filters;
}

/**
 * Href de `/provas` mesclando `patch` sobre `filters`: os parâmetros não
 * mencionados são preservados e os definidos como `undefined` são removidos.
 */
export function buildExamListHref(filters: ExamFilters, patch: Partial<ExamFilters> = {}): string {
  const merged: ExamFilters = { ...filters, ...patch };
  const search = new URLSearchParams();

  if (merged.ano) search.set('ano', merged.ano);
  if (merged.cor) search.set('cor', merged.cor);
  if (merged.disciplina) search.set('disciplina', merged.disciplina);

  const query = search.toString();
  return query ? `/provas?${query}` : '/provas';
}

export function hasActiveFilters(filters: ExamFilters): boolean {
  return Boolean(filters.ano || filters.cor || filters.disciplina);
}

/** Nº de questões do catálogo que pertencem a um caderno (ano + cor). */
export function countExamQuestions(questions: Question[], exam: OfficialExam): number {
  let count = 0;

  for (const question of questions) {
    if (question.year === exam.year && question.bookletColor === exam.bookletColor) count += 1;
  }

  return count;
}

/** Provas que satisfazem todos os filtros ativos (E lógico entre eles). */
export function filterExams(
  exams: OfficialExam[],
  questions: Question[],
  filters: ExamFilters,
): OfficialExam[] {
  const { ano, cor, disciplina } = filters;

  return exams.filter((exam) => {
    if (ano && String(exam.year) !== ano) return false;
    if (cor && exam.bookletColor !== cor) return false;

    if (disciplina) {
      const hasArea = questions.some(
        (question) =>
          question.year === exam.year &&
          question.bookletColor === exam.bookletColor &&
          question.discipline === disciplina,
      );
      if (!hasArea) return false;
    }

    return true;
  });
}

export function findExam(exams: OfficialExam[], examId: string): OfficialExam | undefined {
  return exams.find((exam) => exam.id === examId);
}

const EXAM_ID_PATTERN = /^prova-(\d{4})-(azul|amarela|branca|rosa)$/i;

const BOOKLET_BY_SLUG: Record<string, BookletColor> = {
  azul: 'Azul',
  amarela: 'Amarela',
  branca: 'Branca',
  rosa: 'Rosa',
};

/**
 * Deriva uma prova mínima a partir do id (`prova-2021-azul`) quando a API
 * devolve questões de um caderno que ainda não está no catálogo local.
 * Ids fora do padrão devolvem `null` — a página então responde 404.
 */
export function deriveExamFromId(examId: string): OfficialExam | null {
  const match = EXAM_ID_PATTERN.exec(examId);
  if (!match) return null;

  const year = Number(match[1]);
  const bookletColor = BOOKLET_BY_SLUG[String(match[2]).toLowerCase()];

  if (!bookletColor || !Number.isInteger(year)) return null;

  return {
    id: examId,
    year,
    bookletColor,
    title: `ENEM ${year} — Caderno ${bookletColor}`,
    subtitle: `Prova oficial do ENEM ${year}, caderno ${bookletColor}, com gabarito e resolução comentada.`,
  };
}
