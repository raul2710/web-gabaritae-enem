import type { BookletColor, DisciplineId } from './types';

export interface DisciplineMeta {
  id: DisciplineId;
  code: string;
  name: string;
  fullName: string;
  shortDesc: string;
  accent: string;
  tint: string;
  icon: string;
}

export interface BookletColorMeta {
  id: BookletColor;
  label: string;
  bg: string;
  border: string;
  ink: string;
  dot: string;
}

/** As 4 Grandes Áreas do Conhecimento do ENEM. */
export const ENEM_DISCIPLINES: DisciplineMeta[] = [
  {
    id: 'matematica',
    code: 'MT',
    name: 'Matemática',
    fullName: 'Matemática e suas Tecnologias',
    shortDesc: 'Geometria, funções, estatística, probabilidade e matemática financeira.',
    accent: '#1D5FBF',
    tint: '#EBF2FC',
    icon: 'compass-outline',
  },
  {
    id: 'natureza',
    code: 'CN',
    name: 'Ciências da Natureza',
    fullName: 'Ciências da Natureza e suas Tecnologias',
    shortDesc: 'Física, Química e Biologia aplicadas a fenômenos cotidianos e ambientais.',
    accent: '#1B6E66',
    tint: '#E4F2F0',
    icon: 'leaf-outline',
  },
  {
    id: 'humanas',
    code: 'CH',
    name: 'Ciências Humanas',
    fullName: 'Ciências Humanas e suas Tecnologias',
    shortDesc: 'História, Geografia, Filosofia e Sociologia: cidadania, território e ética.',
    accent: '#92400E',
    tint: '#FEF3C7',
    icon: 'globe-outline',
  },
  {
    id: 'linguagens',
    code: 'LC',
    name: 'Linguagens',
    fullName: 'Linguagens, Códigos e suas Tecnologias',
    shortDesc: 'Interpretação textual, literatura, artes, funções da linguagem e língua estrangeira.',
    accent: '#87214D',
    tint: '#FCEEF4',
    icon: 'book-outline',
  },
];

/** Cores oficiais dos Cadernos do ENEM (Azul, Amarela, Branca, Rosa). */
export const BOOKLET_COLORS: Record<BookletColor, BookletColorMeta> = {
  Azul: {
    id: 'Azul',
    label: 'Caderno Azul',
    bg: '#EBF2FC',
    border: '#B8D2F4',
    ink: '#164B96',
    dot: '#1D5FBF',
  },
  Amarela: {
    id: 'Amarela',
    label: 'Caderno Amarelo',
    bg: '#FEF7E6',
    border: '#F3D89B',
    ink: '#7D5106',
    dot: '#D99B26',
  },
  Branca: {
    id: 'Branca',
    label: 'Caderno Branco',
    bg: '#F3F3F1',
    border: '#D6D6D0',
    ink: '#30302E',
    dot: '#6E6E6A',
  },
  Rosa: {
    id: 'Rosa',
    label: 'Caderno Rosa',
    bg: '#FCEEF4',
    border: '#EEBBD1',
    ink: '#87214D',
    dot: '#C83E78',
  },
};

/** Chave Pix oficial (chave aleatória EVP) usada no modal de apoio ao projeto. */
export const PIX_RANDOM_KEY = 'c639b424-9644-47c5-a6e0-47e8894de02e';
export const PIX_KEY_COPIA_E_COLA = PIX_RANDOM_KEY;
