import type { DisciplineId, OfficialExam, Question, TheoryModule } from '@/domain/types';

import { ENEM_QUESTIONS, OFFICIAL_EXAMS, THEORY_MODULES } from './enemMockData';

/**
 * Catálogo local tipado do ENEM (dataset enem.dev importado de `enemMockData.js`).
 * Os casts `as unknown as ...` são intencionais: o dataset é JS legado sem tipagem.
 */
export const questions = ENEM_QUESTIONS as unknown as Question[];

export const theoryModules = THEORY_MODULES as unknown as Record<DisciplineId, TheoryModule[]>;

export const officialExams = OFFICIAL_EXAMS as unknown as OfficialExam[];
