import { describe, expect, it } from 'vitest';

import {
  computeStats,
  getLatestAttempts,
  getSubjectPerformance,
  getWeeklySeries,
} from '@/domain/stats';
import type { AnswerAttempt, DisciplineId } from '@/domain/types';

function attempt(
  questionId: string,
  timestamp: string,
  overrides: Partial<AnswerAttempt> = {},
): AnswerAttempt {
  return {
    questionId,
    discipline: 'matematica' as DisciplineId,
    year: 2024,
    selectedAlternative: 'A',
    correctAlternative: 'A',
    isCorrect: true,
    timestamp,
    ...overrides,
  };
}

/** 11/11/2026 (quarta-feira) ao meio-dia, fuso local. */
const NOW = new Date(2026, 10, 11, 12, 0, 0);

describe('getLatestAttempts', () => {
  it('mantém apenas a tentativa mais recente de cada questão', () => {
    const attempts = [
      attempt('q-1', '2026-11-10T09:00:00', { isCorrect: true, selectedAlternative: 'A' }),
      attempt('q-2', '2026-11-10T10:00:00', { isCorrect: false, selectedAlternative: 'B' }),
      // Segunda tentativa de q-1: errada e mais nova — deve prevalecer sobre a primeira.
      attempt('q-1', '2026-11-11T09:00:00', { isCorrect: false, selectedAlternative: 'D' }),
    ];

    const latest = getLatestAttempts(attempts);

    expect(latest).toHaveLength(2);

    const first = latest.find((item) => item.questionId === 'q-1');
    expect(first?.isCorrect).toBe(false);
    expect(first?.selectedAlternative).toBe('D');
    expect(first?.timestamp).toBe('2026-11-11T09:00:00');

    // Ordenado do mais recente para o mais antigo.
    expect(latest[0].questionId).toBe('q-1');
    expect(latest[1].questionId).toBe('q-2');
  });
});

describe('computeStats', () => {
  it('conta apenas o dia de referência na meta diária', () => {
    const attempts = [
      // Ontem (10/11) — fora da meta de hoje.
      attempt('q-old-1', '2026-11-10T08:00:00'),
      attempt('q-old-2', '2026-11-10T09:00:00'),
      // Hoje (11/11): 3 questões únicas, sendo q-today respondida 2 vezes.
      attempt('q-today-1', '2026-11-11T08:00:00'),
      attempt('q-today-1', '2026-11-11T09:00:00', { isCorrect: false }),
      attempt('q-today-2', '2026-11-11T10:00:00'),
      attempt('q-today-3', '2026-11-11T11:00:00'),
    ];

    const stats = computeStats(attempts, 4, NOW);

    expect(stats.totalAttempts).toBe(6);
    expect(stats.uniqueQuestions).toBe(5);
    expect(stats.correct).toBe(5);
    expect(stats.accuracyRate).toBe(83);
    expect(stats.todayCount).toBe(3);
    expect(stats.dailyGoal).toBe(4);
    expect(stats.dailyGoalRate).toBe(75);
  });

  it('limita a 100% quando a meta diária é ultrapassada', () => {
    const attempts = [
      attempt('q-1', '2026-11-11T08:00:00'),
      attempt('q-2', '2026-11-11T09:00:00'),
      attempt('q-3', '2026-11-11T10:00:00'),
    ];

    const stats = computeStats(attempts, 2, NOW);

    expect(stats.todayCount).toBe(3);
    expect(stats.dailyGoalRate).toBe(100);
  });

  it('zera as taxas quando não há tentativas', () => {
    const stats = computeStats([], 15, NOW);

    expect(stats.totalAttempts).toBe(0);
    expect(stats.accuracyRate).toBe(0);
    expect(stats.todayCount).toBe(0);
    expect(stats.dailyGoalRate).toBe(0);
  });
});

describe('getWeeklySeries', () => {
  it('retorna os 7 dias reais anteriores (inclusive hoje) com labels em pt-BR', () => {
    const attempts = [
      // Fora da janela (mais de 7 dias atrás) — não pode aparecer.
      attempt('q-antiga', '2026-10-20T12:00:00'),
      // 05/11 (qui)
      attempt('q-d1', '2026-11-05T12:00:00'),
      // 09/11 (seg): duas tentativas da mesma questão contam uma vez.
      attempt('q-d2', '2026-11-09T12:00:00'),
      attempt('q-d2', '2026-11-09T13:00:00', { isCorrect: false }),
      attempt('q-d2b', '2026-11-09T14:00:00'),
      // Hoje
      attempt('q-hoje', '2026-11-11T09:00:00'),
    ];

    const series = getWeeklySeries(attempts, NOW);

    expect(series).toHaveLength(7);

    expect(series.map((point) => point.date)).toEqual([
      '2026-11-05',
      '2026-11-06',
      '2026-11-07',
      '2026-11-08',
      '2026-11-09',
      '2026-11-10',
      '2026-11-11',
    ]);

    expect(series.map((point) => point.label)).toEqual([
      'qui.',
      'sex.',
      'sáb.',
      'dom.',
      'seg.',
      'ter.',
      'Hoje',
    ]);

    expect(series[6].isToday).toBe(true);
    expect(series.slice(0, 6).every((point) => !point.isToday)).toBe(true);

    expect(series.map((point) => point.count)).toEqual([1, 0, 0, 0, 2, 0, 1]);
  });

  it('marca Hoje apenas no último dia', () => {
    const series = getWeeklySeries([], NOW);

    expect(series.filter((point) => point.isToday)).toHaveLength(1);
    expect(series[6].isToday).toBe(true);
    expect(series[6].label).toBe('Hoje');
  });
});

describe('getSubjectPerformance', () => {
  it('resume total, acertos e taxa por área, sempre nas 4 áreas', () => {
    const attempts = [
      attempt('mt-1', '2026-11-11T08:00:00', { discipline: 'matematica' }),
      attempt('mt-2', '2026-11-11T09:00:00', {
        discipline: 'matematica',
        isCorrect: false,
      }),
      attempt('cn-1', '2026-11-11T10:00:00', { discipline: 'natureza' }),
    ];

    const performance = getSubjectPerformance(attempts);

    expect(performance).toHaveLength(4);
    expect(performance.map((item) => item.discipline)).toEqual([
      'matematica',
      'natureza',
      'humanas',
      'linguagens',
    ]);

    expect(performance[0]).toEqual({
      discipline: 'matematica',
      total: 2,
      correct: 1,
      accuracyRate: 50,
    });
    expect(performance[1].total).toBe(1);
    expect(performance[1].accuracyRate).toBe(100);
    expect(performance[2]).toMatchObject({ total: 0, correct: 0, accuracyRate: 0 });
    expect(performance[3]).toMatchObject({ total: 0, correct: 0, accuracyRate: 0 });
  });
});
