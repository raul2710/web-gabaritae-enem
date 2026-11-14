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
  imageUrl?: string;
}

/** "Pegadinha clássica" destacada nos módulos de teoria e apostilas. */
export interface EnemTrap {
  title: string;
  wrongThinking: string;
  correctThinking: string;
  quickQuestion?: string;
  options?: string[];
  correctOptionIndex?: number;
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

/** Apostila dinâmica no contrato da API REST. */
export type Apostila = TheoryModule;

/** Áreas formais do ENEM segundo a matriz de referência do Inep. */
export type AreaEnem =
  | 'Matemática'
  | 'Ciências da Natureza'
  | 'Ciências Humanas'
  | 'Linguagens';

/** Classificação de recorrência estatística da habilidade no ENEM. */
export type RecorrenciaEnem = 'Alta' | 'Média' | 'Baixa';

export interface ElementoVisualOriginal {
  urlImagem: string;
  altTextAnalitico: string;
}

export interface RoteiroEstrutural {
  elementoCentral: string;
  fluxosERelacoes: string;
  legendaExplicativa: string;
}

export interface EsquemaConceitual {
  objetivoPedagogico: string;
  promptIngles: string;
  promptPortugues: string;
  roteiroEstrutural: RoteiroEstrutural;
}

export interface ItemFixacao {
  referencia: string;
  ano: number;
  aplicacao: string;
  corCaderno: string;
  numeroQuestao: number;
  enunciado: string;
  alternativas: string[];
  gabaritoOficial: AlternativeLetter;
  resolucaoComentada: string;
}

/** Módulo Didático Curado (Padrão Inep + Google NotebookLM). */
export interface ModuloDidatico {
  id: string;
  tituloTematico: string;
  area: AreaEnem;
  disciplina: string;
  competencia: string;
  habilidade: string;
  recorrencia: RecorrenciaEnem;
  fontesCanonicas: string[];
  fundamentacaoTeorica: string;
  elementoVisualOriginal: ElementoVisualOriginal;
  esquemaConceitual: EsquemaConceitual;
  comoCostumaCair: string;
  distratoresComuns: string;
  itemFixacao: ItemFixacao;
  apostilaId: string | null;
  questionId: string | null;
}

export interface PixInfo {
  pixKey: string;
  keyType: string;
  merchantName: string;
  merchantCity: string;
  amount?: number;
  txId: string;
  pixCopiaECola: string;
}

export interface OfflinePack {
  id: string;
  discipline: DisciplineId;
  theory: Apostila[];
  questions: Question[];
  modulosDidaticos: ModuloDidatico[];
  pix: PixInfo;
  sizeKb: number;
}

export interface ModulosResponse {
  count: number;
  modulos: ModuloDidatico[];
}

export interface ModuloDetailResponse {
  modulo: ModuloDidatico;
  notebookLmMarkdown: string;
}

export interface ApostilaDetailResponse {
  apostila: Apostila;
  relatedQuestions: Question[];
}

export interface QuestionsResponse {
  count: number;
  questions: Question[];
}

export interface ImportResult {
  success: boolean;
  message: string;
  id?: string;
  rejectedUrls?: string[];
  errors?: string[];
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
  avatarUrl?: string;
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

/** Objetivo do aluno para o ENEM (curso/foco, universidade, nota de corte alvo e data da prova). */
export interface StudyGoal {
  /** Curso ou área de foco (ex.: Medicina, Engenharia de Software, Direito). */
  focusCourse: string;
  /** Universidade desejada (ex.: USP, UNICAMP, UFMG, UFRJ). */
  targetUniversity: string;
  /** Nota alvo no ENEM (escala TRI: 400 a 1000). */
  targetScore: number;
  /** Data personalizada do 1º dia de prova do ENEM (YYYY-MM-DD), opcional. */
  examDate?: string;
  /** ISO 8601 da última atualização. */
  updatedAt: string;
}

/** Categorias de resumos e anotações do aluno (4 áreas do ENEM + Redação e Geral). */
export type StudyNoteDiscipline = DisciplineId | 'redacao' | 'geral';

/** Anotação/resumo salvo pelo aluno na aba de Resumos. */
export interface StudyNote {
  id: string;
  title: string;
  discipline: StudyNoteDiscipline;
  subject: string;
  content: string;
  keyPoints: string[];
  pinned: boolean;
  /** ID opcional da apostila de origem, quando salvo a partir de "Estudar" ou "Raio-X Visual". */
  sourceModuleId?: string;
  createdAt: string;
  updatedAt: string;
}
