import type { Question } from './types';

export interface SimulatorHistoryEntry {
  questionId: string;
  isCorrect?: boolean;
}

export interface CustomSimulatorParams {
  questionsCatalog?: Question[];
  answeredHistory?: SimulatorHistoryEntry[];
  discipline?: string;
  difficulty?: string;
  onlyUnanswered?: boolean;
  requestedCount?: number;
  autoFillShortfall?: boolean;
}

export interface CustomSimulatorPack {
  questions: Question[];
  requestedCount: number;
  returnedCount: number;
  strictlyMatchedCount: number;
  autoFilledCount: number;
  shortfallCount: number;
  isPartial: boolean;
  status: 'complete' | 'partial' | 'empty';
  message: string;
}

/**
 * Monta o caderno de questões do Simulador Personalizado e valida explicitamente
 * se a quantidade retornada corresponde à quantidade solicitada pelo estudante
 * (ex.: pediu 24 questões, mas os filtros atuais só retornaram 4).
 */
export function buildCustomSimulatorPack({
  questionsCatalog = [],
  answeredHistory = [],
  discipline = 'todas',
  difficulty = 'Todas',
  onlyUnanswered = false,
  requestedCount = 6,
  autoFillShortfall = false,
}: CustomSimulatorParams = {}): CustomSimulatorPack {
  const safeCatalog = Array.isArray(questionsCatalog) ? questionsCatalog : [];
  const safeHistory = Array.isArray(answeredHistory) ? answeredHistory : [];
  const targetCount = Math.max(1, Number(requestedCount) || 6);
  const answeredIds = new Set(safeHistory.map((answer) => answer.questionId));

  let strictPool = [...safeCatalog];

  if (discipline && discipline !== 'todas') {
    strictPool = strictPool.filter((question) => question.discipline === discipline);
  }
  if (difficulty && difficulty !== 'Todas') {
    strictPool = strictPool.filter((question) => question.difficulty === difficulty);
  }
  if (onlyUnanswered) {
    strictPool = strictPool.filter((question) => !answeredIds.has(question.id));
  }

  const strictlyMatchedCount = strictPool.length;
  const selectedQuestions = strictPool.slice(0, targetCount);
  let autoFilledCount = 0;

  if (autoFillShortfall && selectedQuestions.length < targetCount) {
    const pickedIds = new Set(selectedQuestions.map((q) => q.id));

    // Prioridade 1: mesma matéria (relaxando dificuldade/inéditas)
    // Prioridade 2: inéditas de outras matérias
    // Prioridade 3: restante do catálogo
    const candidates = [
      ...safeCatalog.filter((q) => discipline !== 'todas' && q.discipline === discipline),
      ...safeCatalog.filter((q) => !answeredIds.has(q.id)),
      ...safeCatalog,
    ];

    for (const candidate of candidates) {
      if (selectedQuestions.length >= targetCount) break;
      if (candidate && candidate.id && !pickedIds.has(candidate.id)) {
        pickedIds.add(candidate.id);
        selectedQuestions.push(candidate);
        autoFilledCount += 1;
      }
    }
  }

  const returnedCount = selectedQuestions.length;
  const shortfallCount = Math.max(0, targetCount - returnedCount);
  const isPartial = returnedCount > 0 && returnedCount < targetCount;

  let status: CustomSimulatorPack['status'] = 'complete';
  let message = `Simulado pronto com ${returnedCount} questões!`;

  if (returnedCount === 0) {
    status = 'empty';
    message = 'Nenhuma questão com esses filtros. Tente ampliar a seleção.';
  } else if (isPartial) {
    status = 'partial';
    message = `Seu simulado tem ${returnedCount} de ${targetCount} questões. Ajuste os filtros para incluir mais.`;
  } else if (autoFilledCount > 0) {
    status = 'complete';
    message = `Simulado pronto com ${returnedCount} questões (${strictlyMatchedCount} do filtro + ${autoFilledCount} extras).`;
  }

  return {
    questions: selectedQuestions,
    requestedCount: targetCount,
    returnedCount,
    strictlyMatchedCount,
    autoFilledCount,
    shortfallCount,
    isPartial,
    status,
    message,
  };
}
