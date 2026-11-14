import { officialExams, questions as localQuestions, theoryModules } from '@/data/catalog';
import { MOCK_MODULOS_DIDATICOS, OFFICIAL_PIX_FALLBACK } from '@/data/mockModulos';
import { normalizeAndMergeQuestionsCatalog } from '@/domain/questions';
import type {
  Apostila,
  ApostilaDetailResponse,
  DisciplineId,
  ImportResult,
  ModuloDetailResponse,
  ModuloDidatico,
  ModulosResponse,
  OfficialExam,
  OfflinePack,
  PixInfo,
  Question,
  QuestionsResponse,
  TheoryModule,
} from '@/domain/types';
import {
  getAllSavedOfflineApostilas,
  getAllSavedOfflineModulos,
  getAllSavedOfflineQuestions,
  getOfflinePack,
  getOfflinePix,
  saveOfflinePack,
  saveOfflinePix,
} from './offline-storage';

/**
 * URL base da API REST Gabaritaê ENEM.
 * Suporta NEXT_PUBLIC_API_URL, VITE_API_URL, JAVA_API_URL e NEXT_PUBLIC_API_BASE_URL.
 */
export const JAVA_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.VITE_API_URL ||
  process.env.JAVA_API_URL ||
  'http://localhost:8080/api/v1';

/**
 * Base no browser: se NEXT_PUBLIC_API_URL estiver configurada, podemos utilizá-la diretamente,
 * ou usar o proxy interno /api/backend para evitar problemas de CORS no desenvolvimento.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.VITE_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  '/api/backend';

export const API_TIMEOUT_MS = 2500;

let serverOfflineCooldownUntil = 0;
const SERVER_OFFLINE_COOLDOWN_MS = 8_000;

export function resolveApiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;

  const base = typeof window === 'undefined' ? JAVA_API_URL : API_BASE_URL;
  const normalizedBase = base.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${normalizedBase}${normalizedPath}`;
}

export async function fetchJson<T>(
  path: string,
  init?: RequestInit,
  timeoutMs: number = API_TIMEOUT_MS,
): Promise<T | null> {
  const isServer = typeof window === 'undefined';
  if (isServer && Date.now() < serverOfflineCooldownUntil) {
    return null;
  }

  try {
    const url = resolveApiUrl(path);
    const response = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        accept: 'application/json',
        ...(init?.body && typeof init.body === 'string'
          ? { 'content-type': 'application/json' }
          : {}),
        ...init?.headers,
      },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    if (isServer) {
      serverOfflineCooldownUntil = Date.now() + SERVER_OFFLINE_COOLDOWN_MS;
    }
    return null;
  }
}

function extractList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== 'object') return [];

  const record = data as Record<string, unknown>;
  if (Array.isArray(record.questions)) return record.questions;
  if (Array.isArray(record.modulos)) return record.modulos;
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

// =========================================================================
// A. MÓDULOS DIDÁTICOS CURADOS (Padrão Inep + NotebookLM)
// =========================================================================

export interface FetchModulosParams {
  area?: string;
  disciplina?: string;
  competencia?: string;
  habilidade?: string;
  recorrencia?: string;
}

/**
 * Busca módulos didáticos com filtros. Em caso de falha ou offline,
 * devolve do cache local ou MOCK_MODULOS_DIDATICOS.
 */
export async function fetchModulos(params: FetchModulosParams = {}): Promise<ModuloDidatico[]> {
  const search = new URLSearchParams();
  if (params.area) search.set('area', params.area);
  if (params.disciplina) search.set('disciplina', params.disciplina);
  if (params.competencia) search.set('competencia', params.competencia);
  if (params.habilidade) search.set('habilidade', params.habilidade);
  if (params.recorrencia) search.set('recorrencia', params.recorrencia);

  const query = search.toString();
  const res = await fetchJson<ModulosResponse | ModuloDidatico[]>(`/modulos${query ? `?${query}` : ''}`);

  let list: ModuloDidatico[] = [];

  if (res) {
    if (Array.isArray(res)) {
      list = res;
    } else if (Array.isArray(res.modulos)) {
      list = res.modulos;
    }
  }

  // Fallback offline (localStorage)
  if (list.length === 0 && typeof window !== 'undefined') {
    const offlineSaved = getAllSavedOfflineModulos();
    if (offlineSaved.length > 0) {
      list = offlineSaved;
    }
  }

  // Fallback de catálogo canônico
  if (list.length === 0) {
    list = MOCK_MODULOS_DIDATICOS;
  }

  // Filtros aplicados localmente se vierem do fallback
  if (params.area) {
    list = list.filter((m) => m.area.toLowerCase() === params.area?.toLowerCase());
  }
  if (params.disciplina) {
    list = list.filter((m) => m.disciplina.toLowerCase() === params.disciplina?.toLowerCase());
  }
  if (params.recorrencia) {
    list = list.filter((m) => m.recorrencia.toLowerCase() === params.recorrencia?.toLowerCase());
  }
  if (params.competencia) {
    list = list.filter((m) => m.competencia.toLowerCase().includes(params.competencia!.toLowerCase()));
  }
  if (params.habilidade) {
    list = list.filter((m) => m.habilidade.toLowerCase().includes(params.habilidade!.toLowerCase()));
  }

  return list;
}

/**
 * Retorna detalhes do módulo didático e seu markdown de apoio para NotebookLM.
 */
export async function getModuloById(id: string): Promise<ModuloDetailResponse | null> {
  const data = await fetchJson<ModuloDetailResponse | ModuloDidatico>(`/modulos/${encodeURIComponent(id)}`);

  if (data) {
    if ('modulo' in data && data.modulo) {
      return data as ModuloDetailResponse;
    }
    return {
      modulo: data as ModuloDidatico,
      notebookLmMarkdown: (data as ModuloDidatico).fundamentacaoTeorica,
    };
  }

  // Fallback offline
  const offlineList = typeof window !== 'undefined' ? getAllSavedOfflineModulos() : [];
  const found = [...offlineList, ...MOCK_MODULOS_DIDATICOS].find((m) => m.id === id);

  if (found) {
    return {
      modulo: found,
      notebookLmMarkdown: `# ${found.tituloTematico}\n\n**Área:** ${found.area} | **Disciplina:** ${found.disciplina}\n**Habilidade:** ${found.habilidade}\n\n${found.fundamentacaoTeorica}\n\n### Como Costuma Cair\n${found.comoCostumaCair}\n\n### Distratores Comuns\n${found.distratoresComuns}`,
    };
  }

  return null;
}

/**
 * Retorna o schema rico de engenharia de conteúdo em JSON.
 */
export async function getModuloJson(id: string): Promise<Record<string, unknown> | null> {
  return await fetchJson<Record<string, unknown>>(`/modulos/${encodeURIComponent(id)}/json`);
}

/**
 * URL direta de download do Markdown para o Google NotebookLM.
 */
export function getModuloMarkdownDownloadUrl(id: string): string {
  return resolveApiUrl(`/modulos/${encodeURIComponent(id)}/markdown`);
}

/**
 * URL direta de export consolidado por área para o NotebookLM.
 */
export function getExportNotebookLmUrl(area?: string): string {
  return resolveApiUrl(`/modulos/export/notebooklm${area ? `?area=${encodeURIComponent(area)}` : ''}`);
}

/**
 * Importação de módulo via Markdown com validação estrita de Whitelist.
 */
export async function importModuloMarkdown(markdownContent: string): Promise<ImportResult> {
  try {
    const url = resolveApiUrl('/modulos/import-markdown');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'text/markdown; charset=utf-8',
        accept: 'application/json',
      },
      body: markdownContent,
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Erro ${response.status} ao importar Markdown`,
        rejectedUrls: data.rejectedUrls || data.errors,
      };
    }

    return {
      success: true,
      message: data.message || 'Módulo didático importado com sucesso!',
      id: data.id,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Falha de conexão com a API',
    };
  }
}

/**
 * Importação de módulo via JSON com validação estrita de Whitelist.
 */
export async function importModuloJson(jsonData: unknown): Promise<ImportResult> {
  try {
    const url = resolveApiUrl('/modulos/import-json');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: typeof jsonData === 'string' ? jsonData : JSON.stringify(jsonData),
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Erro ${response.status} ao importar JSON`,
        rejectedUrls: data.rejectedUrls || data.errors,
      };
    }

    return {
      success: true,
      message: data.message || 'Módulo didático JSON importado com sucesso!',
      id: data.id,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Falha de conexão com a API',
    };
  }
}

// =========================================================================
// B. APOSTILAS DINÂMICAS E RADAR ANTI-PEGADINHAS
// =========================================================================

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

/**
 * Busca apostilas dinâmicas com suporte a filtro por disciplina.
 */
export async function fetchApostilas(discipline?: DisciplineId): Promise<Record<DisciplineId, TheoryModule[]>> {
  const path = discipline ? `/apostilas?discipline=${encodeURIComponent(discipline)}` : '/apostilas';
  const data = await fetchJson<unknown>(path);
  const parsed = toTheoryModules(data);

  if (parsed) return parsed;

  // Fallback offline (localStorage)
  if (typeof window !== 'undefined') {
    const saved = getAllSavedOfflineApostilas();
    if (saved.matematica.length || saved.natureza.length || saved.humanas.length || saved.linguagens.length) {
      return saved;
    }
  }

  return theoryModules;
}

export async function getTheoryModules(): Promise<Record<DisciplineId, TheoryModule[]>> {
  return fetchApostilas();
}

/**
 * Busca apostila específica pelo ID e questões relacionadas.
 */
export async function getApostilaById(id: string): Promise<ApostilaDetailResponse | null> {
  const data = await fetchJson<ApostilaDetailResponse | Apostila>(`/apostilas/${encodeURIComponent(id)}`);

  if (data) {
    if ('apostila' in data && data.apostila) {
      return data as ApostilaDetailResponse;
    }
    return {
      apostila: data as Apostila,
      relatedQuestions: [],
    };
  }

  // Fallback nos dados locais
  for (const discipline of Object.keys(theoryModules) as DisciplineId[]) {
    const found = theoryModules[discipline]?.find((item) => item.id === id);
    if (found) {
      const related = localQuestions.filter((q) => q.apostilaId === id || q.subject === found.subject);
      return {
        apostila: found,
        relatedQuestions: related,
      };
    }
  }

  return null;
}

// =========================================================================
// C. BANCO DE QUESTÕES E LOTES
// =========================================================================

export interface FetchQuestionsParams {
  year?: number | string;
  discipline?: string;
  bookletColor?: string;
}

export async function fetchQuestions(params: FetchQuestionsParams = {}): Promise<Question[]> {
  const search = new URLSearchParams();
  if (params.year) search.set('year', String(params.year));
  if (params.discipline) search.set('discipline', params.discipline);
  if (params.bookletColor) search.set('bookletColor', params.bookletColor);

  const query = search.toString();
  const data = await fetchJson<QuestionsResponse | Question[]>(`/questions${query ? `?${query}` : ''}`);
  
  let incoming = extractList(data);

  // Fallback offline
  if (incoming.length === 0 && typeof window !== 'undefined') {
    const saved = getAllSavedOfflineQuestions();
    if (saved.length > 0) {
      incoming = saved;
    }
  }

  const merged = normalizeAndMergeQuestionsCatalog(localQuestions, incoming);
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

/**
 * Cadastra lotes de questões com validação anti-colisão.
 */
export async function postQuestionsBatch(batch: Partial<Question>[]): Promise<{ count: number; ids: string[] }> {
  const res = await fetchJson<{ count: number; ids: string[] }>('/questions/batch', {
    method: 'POST',
    body: JSON.stringify(batch),
  });

  return res ?? { count: 0, ids: [] };
}

export async function getAllExams(): Promise<OfficialExam[]> {
  const data = await fetchJson<unknown>('/exams');
  const list = extractList(data).filter(
    (item): item is OfficialExam => Boolean(item) && typeof item === 'object',
  );

  return list.length > 0 ? list : officialExams;
}

export async function getExamQuestions(examId: string): Promise<Question[]> {
  const data = await fetchJson<unknown>(`/exams/${encodeURIComponent(examId)}/questions`);
  const apiList = extractList(data);

  if (apiList.length > 0) {
    const merged = normalizeAndMergeQuestionsCatalog([], apiList);
    if (merged.validCount > 0) return merged.questions;
  }

  const exam = officialExams.find((item) => item.id === examId);
  if (!exam) return localQuestions;

  return localQuestions.filter(
    (question) => question.year === exam.year && question.bookletColor === exam.bookletColor,
  );
}

// =========================================================================
// D. MODO OFFLINE E CHAVE PIX (BR CODE)
// =========================================================================

/**
 * Baixa e armazena em localStorage o pacote offline completo de uma disciplina.
 */
export async function fetchOfflinePack(discipline: DisciplineId): Promise<OfflinePack | null> {
  const data = await fetchJson<OfflinePack>(`/offline-pack/${encodeURIComponent(discipline)}`);

  if (data) {
    if (typeof window !== 'undefined') {
      saveOfflinePack(data);
    }
    return data;
  }

  // Fallback se a API estiver offline mas já houver pacote salvo
  if (typeof window !== 'undefined') {
    const cached = getOfflinePack(discipline);
    if (cached) return cached;
  }

  // Fallback sintético baseado no catálogo local para não deixar o usuário na mão
  const areaTheory = theoryModules[discipline] ?? [];
  const areaQuestions = localQuestions.filter((q) => q.discipline === discipline);
  const areaModulos = MOCK_MODULOS_DIDATICOS.filter(
    (m) =>
      (discipline === 'matematica' && m.area === 'Matemática') ||
      (discipline === 'natureza' && m.area === 'Ciências da Natureza') ||
      (discipline === 'humanas' && m.area === 'Ciências Humanas') ||
      (discipline === 'linguagens' && m.area === 'Linguagens'),
  );

  const fallbackPack: OfflinePack = {
    id: `pack-${discipline}-local`,
    discipline,
    theory: areaTheory,
    questions: areaQuestions,
    modulosDidaticos: areaModulos,
    pix: OFFICIAL_PIX_FALLBACK,
    sizeKb: 120,
  };

  if (typeof window !== 'undefined') {
    saveOfflinePack(fallbackPack);
  }

  return fallbackPack;
}

/**
 * Obtém a chave Pix de Raul Danielli com QR Code Copia e Cola (valor livre).
 */
export async function fetchPix(txId = 'APOIOENEM'): Promise<PixInfo> {
  void txId;
  return OFFICIAL_PIX_FALLBACK;
}
