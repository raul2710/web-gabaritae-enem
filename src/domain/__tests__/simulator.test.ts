import { describe, expect, it } from 'vitest';

import { questions } from '@/data/catalog';
import { buildCustomSimulatorPack } from '@/domain/simulator';

describe('buildCustomSimulatorPack', () => {
  it('sinaliza status partial quando o filtro só devolve 4 de 24 pedidas', () => {
    // Cenário real: 5 questões Difíceis no banco, sendo 1 já respondida -> sobram apenas 4
    const firstHardQuestion = questions.find((q) => q.difficulty === 'Difícil');
    expect(firstHardQuestion).toBeDefined();

    const answeredHistory = [{ questionId: firstHardQuestion!.id, isCorrect: true }];

    const result = buildCustomSimulatorPack({
      questionsCatalog: questions,
      answeredHistory,
      discipline: 'todas',
      difficulty: 'Difícil',
      onlyUnanswered: true,
      requestedCount: 24,
      autoFillShortfall: false,
    });

    expect(result.requestedCount).toBe(24);
    expect(result.returnedCount).toBe(4);
    expect(result.shortfallCount).toBe(20);
    expect(result.isPartial).toBe(true);
    expect(result.status).toBe('partial');
    expect(result.message).toMatch(/Seu simulado tem 4 de 24 questões/);
  });

  it('autoFillShortfall completa as 20 faltantes sem duplicar nenhuma questão', () => {
    const firstHardQuestion = questions.find((q) => q.difficulty === 'Difícil');
    expect(firstHardQuestion).toBeDefined();

    const answeredHistory = [{ questionId: firstHardQuestion!.id, isCorrect: true }];

    const result = buildCustomSimulatorPack({
      questionsCatalog: questions,
      answeredHistory,
      discipline: 'todas',
      difficulty: 'Difícil',
      onlyUnanswered: true,
      requestedCount: 24,
      autoFillShortfall: true,
    });

    expect(result.requestedCount).toBe(24);
    expect(result.returnedCount).toBe(24);
    expect(result.strictlyMatchedCount).toBe(4);
    expect(result.autoFilledCount).toBe(20);
    expect(result.shortfallCount).toBe(0);
    expect(result.isPartial).toBe(false);
    expect(result.status).toBe('complete');

    const uniqueIds = new Set(result.questions.map((q) => q.id));
    expect(uniqueIds.size).toBe(24);
  });
});
