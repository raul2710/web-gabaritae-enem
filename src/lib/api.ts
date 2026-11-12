import { officialExams, questions as localQuestions, theoryModules } from '@/data/catalog';
import { normalizeAndMergeQuestionsCatalog } from '@/domain/questions';
import type { DisciplineId, OfficialExam, Question, TheoryModule } from '@/domain/types';

/**
 * Base da API Java no servidor (usada em route handlers e Server Components).
 * No browser o Next faz o proxy via rewrite `/api/backend/*` (ver `next.config.ts`).
 */
export const JAVA_API_URL = process.env.JAVA_API_URL ?? 'http://localhost:8080/api/v1';

/** Base usada no cliente — aponta para o rewrite do próprio Next. */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/backend';

/** Timeout curto: a página nunca deve travar esperando o backend. */
export const API_TIMEOUT_MS = 1500;

function resolveUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;

  const base = typeof window === 'undefined' ? JAVA_API_URL : API_BASE_URL;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${base.replace(/\/+$/, '')}${normalizedPath}`;
}

/**
 * `fetch` com timeout e falha silenciosa (`null`), para que a UI caia
 * sempre nos dados locais quando a API Java estiver indisponível.
 */
export async function fetchJson<T>(
  path: string,
  init?: RequestInit,
  timeoutMs: number = API_TIMEOUT_MS,
): Promise<T | null> {
  try {
    const response = await fetch(resolveUrl(path), {
      ...init,
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        accept: 'application/json',
        ...(init?.body ? { 'content-type': 'application/json' } : {}),
        ...init?.headers,
      },
    });

    if (!response.ok) return null;

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

/** Aceita `[]`, `{ questions: [] }` ou `{ content: [] }`. */
function extractList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== 'object') return [];

  const record = data as Record<string, unknown>;
  if (Array.isArray(record.questions)) return record.questions;
  if (Array.isArray(record.content)) return record.content;
  if (Array.isArray(record.data)) return record.data;

  return [];
}

function extractRecord(data: unknown): Record<string, unknown> | null {
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }
  return null;
}

export interface FetchQuestionsParams {
  year?: number | string;
  discipline?: string;
  bookletColor?: string;
}

/**
 * Questões da API Java; em falha, devolve o catálogo local.
 * A resposta da API é **mesclada** ao catálogo local via
 * `normalizeAndMergeQuestionsCatalog` (nada da API é descartado).
 */
export async function fetchQuestions(params: FetchQuestionsParams = {}): Promise<Question[]> {
  const search = new URLSearchParams();
  if (params.year) search.set('year', String(params.year));
  if (params.discipline) search.set('discipline', params.discipline);
  if (params.bookletColor) search.set('bookletColor', params.bookletColor);

  const query = search.toString();
  const data = await fetchJson<unknown>(`/questions${query ? `?${query}` : ''}`);
  const merged = normalizeAndMergeQuestionsCatalog(localQuestions, extractList(data));

  let result = merged.questions;

  if (params.year) {
    const year = Number(params.year);
    result = result.filter((question) => question.year === year);
  }
  if (params.discipline) {
    result = result.filter((question) => question.discipline === params.discipline);
  }
  if (params.bookletColor) {
    result = result.filter((question) => question.bookletColor === params.bookletColor);
  }

  return result;
}

function toTheoryModules(data: unknown): Record<DisciplineId, TheoryModule[]> | null {
  const record = extractRecord(data);
  if (!record) return null;

  const payload = (record.theoryModules ?? record.apostilas ?? record.content ?? record) as Record<
    string,
    unknown
  >;

  const result = {} as Record<DisciplineId, TheoryModule[]>;
  let found = false;

  for (const key of Object.keys(payload)) {
    if (Array.isArray(payload[key])) {
      result[key as DisciplineId] = payload[key] as TheoryModule[];
      found = true;
    }
  }

  return found ? result : null;
}

/** Apostilas/teoria da API; em falha, devolve os módulos locais. */
export async function fetchApostilas(): Promise<Record<DisciplineId, TheoryModule[]>> {
  const data = await fetchJson<unknown>('/apostilas');
  return toTheoryModules(data) ?? theoryModules;
}

/** Módulos de teoria da API; em falha, devolve os módulos locais. */
export async function getTheoryModules(): Promise<Record<DisciplineId, TheoryModule[]>> {
  const data = await fetchJson<unknown>('/theory-modules');
  return toTheoryModules(data) ?? theoryModules;
}

/** Provas oficiais da API; em falha, devolve a lista local. */
export async function getAllExams(): Promise<OfficialExam[]> {
  const data = await fetchJson<unknown>('/exams');
  const list = extractList(data).filter(
    (item): item is OfficialExam => Boolean(item) && typeof item === 'object',
  );

  return list.length > 0 ? list : officialExams;
}

/** Questões de uma prova específica; em falha, filtra o catálogo local. */
export async function getExamQuestions(examId: string): Promise<Question[]> {
  const data = await fetchJson<unknown>(`/exams/${encodeURIComponent(examId)}/questions`);
  const apiList = extractList(data);

  if (apiList.length > 0) {
    // A API é a fonte da verdade para esta prova: nada da resposta é descartado.
    const merged = normalizeAndMergeQuestionsCatalog([], apiList);
    if (merged.validCount > 0) return merged.questions;
  }

  const exam = officialExams.find((item) => item.id === examId);
  if (!exam) return localQuestions;

  return localQuestions.filter(
    (question) => question.year === exam.year && question.bookletColor === exam.bookletColor,
  );
}
