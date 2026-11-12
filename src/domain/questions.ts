import type { AlternativeLetter, DisciplineId, Question } from './types';

const VALID_DISCIPLINES = new Set<DisciplineId>([
  'matematica',
  'natureza',
  'humanas',
  'linguagens',
]);
const VALID_ALTERNATIVES = new Set(['A', 'B', 'C', 'D', 'E']);

function normalizeDisciplineSlug(rawDiscipline = '', rawArea = ''): DisciplineId {
  const combined = `${rawDiscipline} ${rawArea}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  if (VALID_DISCIPLINES.has(combined as DisciplineId)) return combined as DisciplineId;
  if (combined.includes('matemat')) return 'matematica';
  if (
    combined.includes('natureza') ||
    combined.includes('fisic') ||
    combined.includes('quimic') ||
    combined.includes('biolog')
  ) {
    return 'natureza';
  }
  if (
    combined.includes('humana') ||
    combined.includes('histori') ||
    combined.includes('geograf') ||
    combined.includes('filosof') ||
    combined.includes('sociolog')
  ) {
    return 'humanas';
  }
  if (
    combined.includes('linguagen') ||
    combined.includes('portugues') ||
    combined.includes('literatur') ||
    combined.includes('ingles') ||
    combined.includes('espanhol') ||
    combined.includes('arte')
  ) {
    return 'linguagens';
  }
  return 'matematica';
}

/** Item rejeitado no merge, com o motivo legível para a UI. */
export interface RejectedQuestionItem {
  index: number;
  id?: unknown;
  reason: string;
}

export interface MergeQuestionsResult {
  questions: Question[];
  receivedCount: number;
  validCount: number;
  rejectedCount: number;
  rejectedItems: RejectedQuestionItem[];
  collisionResolvedCount: number;
  hasDiscrepancy: boolean;
  warnings: string[];
}

type RawQuestion = Record<string, unknown>;

function asString(value: unknown): string {
  return String(value ?? '').trim();
}

/**
 * Normaliza e valida um lote de questões vindas da API ou de importação,
 * evitando:
 * 1) Perda silenciosa de questões sem `id` explícito;
 * 2) Sobrescrita silenciosa quando múltiplas questões distintas compartilham o mesmo `id`
 *    (ex: 24 questões geradas para as 4 áreas usando IDs repetidos por matéria/módulo,
 *    o que antes reduzia 24 questões para apenas 4 sem avisar);
 * 3) Aceitação silenciosa de questões sem enunciado ou sem as 5 alternativas.
 */
export function normalizeAndMergeQuestionsCatalog(
  baseQuestions: Question[] = [],
  rawApiQuestions: unknown[] = [],
): MergeQuestionsResult {
  const safeBase = Array.isArray(baseQuestions) ? baseQuestions : [];
  const incomingList = Array.isArray(rawApiQuestions) ? rawApiQuestions : [];

  const byId = new Map<string, Question>();
  safeBase.forEach((q) => {
    if (q && q.id) {
      byId.set(String(q.id), { ...q });
    }
  });

  const seenIncomingIds = new Map<string, string>(); // id -> normalizedTitle
  const rejectedItems: RejectedQuestionItem[] = [];
  const warnings: string[] = [];
  let validCount = 0;
  let collisionResolvedCount = 0;

  incomingList.forEach((rawItem, index) => {
    if (!rawItem || typeof rawItem !== 'object') {
      rejectedItems.push({ index, reason: 'OBJETO_INVALIDO' });
      return;
    }

    const raw = rawItem as RawQuestion;

    const title = asString(raw.title || raw.enunciado || '');
    if (!title) {
      rejectedItems.push({
        index,
        id: raw.id || raw.questionId || null,
        reason: 'ENUNCIADO_VAZIO',
      });
      return;
    }

    const rawAlts = raw.alternatives || raw.alternativas;
    const alternatives = Array.isArray(rawAlts)
      ? rawAlts.map((a) => String(a).trim()).filter(Boolean)
      : [];

    if (alternatives.length < 2) {
      rejectedItems.push({
        index,
        id: raw.id || raw.questionId || null,
        reason: 'ALTERNATIVAS_INSUFICIENTES',
      });
      return;
    }

    const discipline = normalizeDisciplineSlug(
      asString(raw.discipline || raw.disciplina || ''),
      asString(raw.area || raw.subject || ''),
    );
    const year = Number(raw.year || raw.ano) || 2024;
    const bookletColor = asString(
      raw.bookletColor || raw.booklet_color || raw.corCaderno || 'Azul',
    );
    const rawCorrect = asString(
      raw.correctAlternative || raw.correct_alternative || raw.gabaritoOficial || 'A',
    )
      .toUpperCase()
      .slice(0, 1);
    const correctAlternative = (
      VALID_ALTERNATIVES.has(rawCorrect) ? rawCorrect : 'A'
    ) as AlternativeLetter;

    let resolvedId = asString(
      raw.id || raw.questionId || raw.question_id || raw.numeroQuestao || '',
    );

    if (!resolvedId) {
      resolvedId = `api-${year}-${discipline}-${index + 1}`;
    }

    const normalizedTitleKey = title.toLowerCase().replace(/\s+/g, ' ');

    // Verifica se outra questão DIFERENTE no mesmo lote já usou este mesmo ID
    // (ex.: 24 questões geradas com apenas 4 IDs por matéria/módulo).
    if (seenIncomingIds.has(resolvedId)) {
      const previousTitleKey = seenIncomingIds.get(resolvedId);
      if (previousTitleKey !== normalizedTitleKey) {
        let suffix = 2;
        while (seenIncomingIds.has(`${resolvedId}-${suffix}`) || byId.has(`${resolvedId}-${suffix}`)) {
          suffix += 1;
        }
        resolvedId = `${resolvedId}-${suffix}`;
        collisionResolvedCount += 1;
      }
    }

    // Verifica também se colide com uma questão do catálogo base que tem outro enunciado
    if (byId.has(resolvedId) && !seenIncomingIds.has(resolvedId)) {
      const existingBase = byId.get(resolvedId);
      const existingTitleKey = asString(existingBase?.title || '')
        .toLowerCase()
        .replace(/\s+/g, ' ');
      if (existingTitleKey && existingTitleKey !== normalizedTitleKey) {
        let suffix = 2;
        while (byId.has(`${resolvedId}-${suffix}`) || seenIncomingIds.has(`${resolvedId}-${suffix}`)) {
          suffix += 1;
        }
        resolvedId = `${resolvedId}-${suffix}`;
        collisionResolvedCount += 1;
      }
    }

    seenIncomingIds.set(resolvedId, normalizedTitleKey);

    const merged: RawQuestion = {
      ...(byId.get(resolvedId) as unknown as RawQuestion | undefined),
      ...raw,
      id: resolvedId,
      year,
      bookletColor,
      discipline,
      subject: raw.subject || raw.disciplina || discipline,
      difficulty: raw.difficulty || 'Médio',
      topic: raw.topic || raw.tituloTematico || 'Questão Oficial ENEM',
      title,
      alternatives,
      correctAlternative,
      imageUrl: raw.imageUrl ?? raw.image_url ?? null,
      explanation: String(
        raw.explanation || raw.resolucaoComentada || 'Resolução comentada disponível.',
      ).trim(),
      apostilaId: raw.apostilaId || raw.apostila_id || undefined,
    };

    byId.set(resolvedId, merged as unknown as Question);
    validCount += 1;
  });

  const rejectedCount = rejectedItems.length;
  const receivedCount = incomingList.length;
  const hasDiscrepancy = rejectedCount > 0;

  if (collisionResolvedCount > 0) {
    warnings.push(
      `${collisionResolvedCount} questões repetidas foram ajustadas para não se perderem.`,
    );
  }
  if (rejectedCount > 0) {
    warnings.push(
      `${rejectedCount} de ${receivedCount} questões não puderam ser carregadas por estarem incompletas.`,
    );
  }

  return {
    questions: Array.from(byId.values()),
    receivedCount,
    validCount,
    rejectedCount,
    rejectedItems,
    collisionResolvedCount,
    hasDiscrepancy,
    warnings,
  };
}
