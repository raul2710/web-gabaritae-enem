import { ENEM_DISCIPLINES } from './constants';
import type { AnswerAttempt, DisciplineId, StudyStats } from './types';

function parseTimestamp(timestamp: string): number {
  const value = Date.parse(timestamp);
  return Number.isNaN(value) ? Number.NaN : value;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toDayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

/**
 * Última tentativa de cada questão (mais recente por `timestamp`).
 * Em caso de empate, prevalece a que aparece depois no array.
 * O resultado vem ordenado do mais recente para o mais antigo.
 */
export function getLatestAttempts(attempts: AnswerAttempt[]): AnswerAttempt[] {
  const latest = new Map<string, { attempt: AnswerAttempt; time: number; order: number }>();

  attempts.forEach((attempt, order) => {
    const time = parseTimestamp(attempt.timestamp);
    if (Number.isNaN(time)) return;

    const previous = latest.get(attempt.questionId);
    if (!previous || time >= previous.time) {
      latest.set(attempt.questionId, { attempt, time, order });
    }
  });

  return Array.from(latest.values())
    .sort((a, b) => b.time - a.time || b.order - a.order)
    .map((entry) => entry.attempt);
}

/** Estatísticas consolidadas de estudo (meta diária limitada ao dia de referência). */
export function computeStats(
  attempts: AnswerAttempt[],
  dailyGoalQuestions: number,
  now: Date = new Date(),
): StudyStats {
  const safeAttempts = Array.isArray(attempts) ? attempts : [];

  const totalAttempts = safeAttempts.length;
  const uniqueQuestions = new Set(safeAttempts.map((attempt) => attempt.questionId)).size;
  const correct = safeAttempts.filter((attempt) => attempt.isCorrect).length;
  const accuracyRate = totalAttempts > 0 ? Math.round((correct / totalAttempts) * 100) : 0;

  const referenceDay = startOfDay(now);
  const todayQuestions = new Set<string>();
  for (const attempt of safeAttempts) {
    const time = parseTimestamp(attempt.timestamp);
    if (Number.isNaN(time)) continue;
    if (isSameDay(new Date(time), referenceDay)) {
      todayQuestions.add(attempt.questionId);
    }
  }

  const dailyGoal = Math.max(0, Number(dailyGoalQuestions) || 0);
  const todayCount = todayQuestions.size;
  const dailyGoalRate =
    dailyGoal > 0 ? Math.min(100, Math.round((todayCount / dailyGoal) * 100)) : 0;

  return {
    totalAttempts,
    uniqueQuestions,
    correct,
    accuracyRate,
    todayCount,
    dailyGoal,
    dailyGoalRate,
  };
}

export interface WeeklyPoint {
  /** `YYYY-MM-DD` no fuso local. */
  date: string;
  /** Label curto em pt-BR; `Hoje` para o último dia. */
  label: string;
  /** Questões **únicas** respondidas no dia. */
  count: number;
  isToday: boolean;
}

/**
 * Últimos 7 dias reais (inclusive hoje), com labels em pt-BR.
 * A contagem usa questões únicas por dia, igual a `computeStats.todayCount`.
 */
export function getWeeklySeries(attempts: AnswerAttempt[], now: Date = new Date()): WeeklyPoint[] {
  const safeAttempts = Array.isArray(attempts) ? attempts : [];
  const today = startOfDay(now);
  const firstDay = addDays(today, -6);

  const questionsByDay = new Map<string, Set<string>>();
  for (const attempt of safeAttempts) {
    const time = parseTimestamp(attempt.timestamp);
    if (Number.isNaN(time)) continue;

    const day = startOfDay(new Date(time));
    if (day.getTime() < firstDay.getTime() || day.getTime() > today.getTime()) continue;

    const key = toDayKey(day);
    const bucket = questionsByDay.get(key) ?? new Set<string>();
    bucket.add(attempt.questionId);
    questionsByDay.set(key, bucket);
  }

  const weekdayFormatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' });

  const points: WeeklyPoint[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const day = addDays(today, -offset);
    const isToday = offset === 0;
    const key = toDayKey(day);

    points.push({
      date: key,
      label: isToday ? 'Hoje' : weekdayFormatter.format(day),
      count: questionsByDay.get(key)?.size ?? 0,
      isToday,
    });
  }

  return points;
}

export interface SubjectPerformance {
  discipline: DisciplineId;
  total: number;
  correct: number;
  /** 0–100, arredondado; 0 quando não há tentativas na área. */
  accuracyRate: number;
}

/** Total, acertos e taxa de acerto por área do conhecimento (sempre as 4). */
export function getSubjectPerformance(attempts: AnswerAttempt[]): SubjectPerformance[] {
  const safeAttempts = Array.isArray(attempts) ? attempts : [];

  return ENEM_DISCIPLINES.map(({ id }) => {
    const fromArea = safeAttempts.filter((attempt) => attempt.discipline === id);
    const total = fromArea.length;
    const correct = fromArea.filter((attempt) => attempt.isCorrect).length;

    return {
      discipline: id,
      total,
      correct,
      accuracyRate: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  });
}
