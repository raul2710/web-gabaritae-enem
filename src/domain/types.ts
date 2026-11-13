/** As 4 grandes áreas do conhecimento do ENEM. */
export type DisciplineId = 'matematica' | 'natureza' | 'humanas' | 'linguagens';

/** Cores oficiais dos cadernos de prova do ENEM. */
export type BookletColor = 'Azul' | 'Amarela' | 'Branca' | 'Rosa';

export type Difficulty = 'Fácil' | 'Médio' | 'Difícil';

export type AlternativeLetter = 'A' | 'B' | 'C' | 'D' | 'E';

/** Alternativa já identificada pela letra, pronta para renderização. */
export interface Alternative {
  letter: AlternativeLetter;
  text: string;
}

export interface Question {
  id: string;
  year: number;
  bookletColor: BookletColor;
  discipline: DisciplineId;
  subject: string;
  difficulty: Difficulty;
  topic: string;
  title: string;
  /** Texto das 5 alternativas (A–E), na ordem oficial. */
  alternatives: string[];
  correctAlternative: AlternativeLetter;
  /** Pode ser um SVG em Data URI usado pelo dataset local. */
  imageUrl?: string | null;
  explanation: string;
  apostilaId?: string;
}

export interface TheorySection {
  heading: string;
  body: string;
}

/** "Pegadinha clássica" destacada nos módulos de teoria. */
export interface EnemTrap {
  title: string;
  wrongThinking: string;
  correctThinking: string;
  quickQuestion: string;
  options: string[];
  correctOptionIndex: number;
}

export interface TheoryModule {
  id: string;
  discipline: DisciplineId;
  subject: string;
  title: string;
  readingTime: string;
  incidence: string;
  summary: string;
  imageUrl?: string;
  imageCaption?: string;
  enemTrap?: EnemTrap;
  keyFormulas?: string[];
  sections: TheorySection[];
}

export interface OfficialExam {
  id: string;
  year: number;
  bookletColor: BookletColor;
  title: string;
  subtitle: string;
  estimatedSizeKb?: number;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

export interface AnswerAttempt {
  questionId: string;
  discipline: DisciplineId;
  year: number;
  selectedAlternative: string;
  correctAlternative: string;
  isCorrect: boolean;
  /** ISO 8601. */
  timestamp: string;
}

export interface StudyStats {
  totalAttempts: number;
  uniqueQuestions: number;
  correct: number;
  /** 0–100, arredondado. */
  accuracyRate: number;
  /** Questões **únicas** respondidas no dia de referência. */
  todayCount: number;
  dailyGoal: number;
  /** 0–100, limitado a 100. */
  dailyGoalRate: number;
}

/** Objetivo do aluno para o ENEM (curso/foco, universidade e nota de corte alvo). */
export interface StudyGoal {
  /** Curso ou área de foco (ex.: Medicina, Engenharia de Software, Direito). */
  focusCourse: string;
  /** Universidade desejada (ex.: USP, UNICAMP, UFMG, UFRJ). */
  targetUniversity: string;
  /** Nota alvo no ENEM (escala TRI: 400 a 1000). */
  targetScore: number;
  /** ISO 8601 da última atualização. */
  updatedAt: string;
}
