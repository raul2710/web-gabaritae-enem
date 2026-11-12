import { describe, expect, it } from 'vitest';

import { questions } from '@/data/catalog';
import { normalizeAndMergeQuestionsCatalog } from '@/domain/questions';
import { PIX_KEY_COPIA_E_COLA } from '@/domain/constants';

describe('Chave Pix', () => {
  it('corresponde exatamente à chave aleatória oficial do projeto', () => {
    expect(PIX_KEY_COPIA_E_COLA).toBe('c639b424-9644-47c5-a6e0-47e8894de02e');
  });
});

describe('Catálogo local', () => {
  it('possui exatamente 24 questões válidas (6 por área, IDs únicos)', () => {
    expect(questions.length).toBe(24);

    const countsByDiscipline = questions.reduce<Record<string, number>>((acc, q) => {
      acc[q.discipline] = (acc[q.discipline] || 0) + 1;
      return acc;
    }, {});

    expect(countsByDiscipline).toEqual({
      matematica: 6,
      natureza: 6,
      humanas: 6,
      linguagens: 6,
    });

    const uniqueIds = new Set(questions.map((q) => q.id));
    expect(uniqueIds.size).toBe(24);
  });
});

describe('normalizeAndMergeQuestionsCatalog', () => {
  it('preserva as 24 questões distintas que compartilham apenas 4 IDs (1 por área)', () => {
    const areas = ['matematica', 'natureza', 'humanas', 'linguagens'];
    const batch24WithCollidingIds = [];

    for (let i = 0; i < 24; i += 1) {
      const disc = areas[i % 4];
      batch24WithCollidingIds.push({
        id: `q-${disc}`, // ID repetido por área (antes sobrescrevia no Map deixando só 4!)
        discipline: disc,
        year: 2024,
        bookletColor: 'Azul',
        title: `Questão inédita número ${i + 1} da área de ${disc}`,
        alternatives: ['Alt A', 'Alt B', 'Alt C', 'Alt D', 'Alt E'],
        correctAlternative: 'B',
        explanation: `Resolução da questão ${i + 1}`,
      });
    }

    const merged = normalizeAndMergeQuestionsCatalog([], batch24WithCollidingIds);

    expect(merged.receivedCount).toBe(24);
    expect(merged.validCount).toBe(24);
    expect(merged.rejectedCount).toBe(0);
    expect(merged.collisionResolvedCount).toBe(20);
    expect(merged.questions.length).toBe(24);

    const uniqueIds = new Set(merged.questions.map((q) => q.id));
    expect(uniqueIds.size).toBe(24);
  });

  it('detecta discrepância quando só 4 de 24 questões são válidas', () => {
    const batch24WithOnly4Valid = Array.from({ length: 24 }, (_, idx) => {
      if (idx < 4) {
        return {
          id: `q-valida-${idx + 1}`,
          discipline: 'matematica',
          title: `Enunciado válido da questão ${idx + 1}`,
          alternatives: ['A', 'B', 'C', 'D', 'E'],
          correctAlternative: 'C',
        };
      }
      // 20 questões truncadas sem enunciado ou sem alternativas
      return {
        id: `q-invalida-${idx + 1}`,
        discipline: 'matematica',
        title: '',
        alternatives: [],
      };
    });

    const merged = normalizeAndMergeQuestionsCatalog([], batch24WithOnly4Valid);

    expect(merged.receivedCount).toBe(24);
    expect(merged.validCount).toBe(4);
    expect(merged.rejectedCount).toBe(20);
    expect(merged.hasDiscrepancy).toBe(true);
    expect(merged.warnings.length).toBeGreaterThan(0);
    expect(merged.warnings.join(' ')).toMatch(/20 de 24 questões não puderam ser carregadas/);
  });
});
