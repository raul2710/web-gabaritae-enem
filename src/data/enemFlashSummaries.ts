import type { StudyNoteDiscipline } from '@/domain/types';

export interface FlashSummaryItem {
  id: string;
  discipline: StudyNoteDiscipline;
  subject: string;
  title: string;
  incidence: string;
  incidencePercent: number;
  examDay: '1º Dia' | '2º Dia';
  summary: string;
  visualDiagram: Array<{
    step: string;
    detail: string;
  }>;
  keyFormulas: string[];
  goldenTip: string;
}

/**
 * Guia visual de revisão de véspera para o ENEM (100% offline/estático, pronto sem API).
 * Organizado por área do conhecimento e conteúdos de maior recorrência histórica.
 */
export const ENEM_FLASH_SUMMARIES: FlashSummaryItem[] = [
  // ======================== MATEMÁTICA (2º DIA) ========================
  {
    id: 'flash-mt-basica',
    discipline: 'matematica',
    subject: 'Matemática Básica',
    title: 'Razão, Proporção, Escala e Porcentagem',
    incidence: 'Altíssima · ~28% da prova',
    incidencePercent: 95,
    examDay: '2º Dia',
    summary:
      'É o conteúdo número 1 do ENEM. Cai em regras de três, escalas de mapas/maquetes, descontos sucessivos e comparação de custo-benefício.',
    visualDiagram: [
      { step: 'Escala Linear (1 : E)', detail: 'Distância Real = Distância no Mapa × E' },
      { step: 'Escala de Área (1 : E²)', detail: 'Área Real = Área no Mapa × E²' },
      { step: 'Escala de Volume (1 : E³)', detail: 'Volume Real = Volume na Maquete × E³' },
    ],
    keyFormulas: [
      'Escala: E = d (desenho) / D (real) — sempre na mesma unidade!',
      'Aumento de x%: multiplicar por (1 + x/100)',
      'Desconto de x%: multiplicar por (1 - x/100)',
      'Conversão clássica: 1 m³ = 1.000 Litros | 1 cm³ = 1 mL',
    ],
    goldenTip:
      'Pegadinha clássica: Dois aumentos de 10% seguidos NÃO dão 20%, dão 21% (1,1 × 1,1 = 1,21). E na escala volumétrica, nunca esqueça de elevar a escala ao cubo!',
  },
  {
    id: 'flash-mt-estatistica',
    discipline: 'matematica',
    subject: 'Estatística & Probabilidade',
    title: 'Média Ponderada, Mediana, Moda e Desvio Padrão',
    incidence: 'Altíssima · ~18% da prova',
    incidencePercent: 90,
    examDay: '2º Dia',
    summary:
      'Toda prova do ENEM cobra pelo menos 3 questões de estatística (média, mediana, moda e regularidade) e 2 de probabilidade.',
    visualDiagram: [
      { step: '1. Ordenar o Rol', detail: 'SEMPRE coloque os números em ordem crescente antes de achar a Mediana!' },
      { step: '2. Quantidade Ímpar', detail: 'Mediana é exatamente o termo central.' },
      { step: '3. Quantidade Par', detail: 'Mediana é a média aritmética dos 2 termos centrais.' },
    ],
    keyFormulas: [
      'Média Ponderada: Mp = (x₁·p₁ + x₂·p₂ + ...) / (p₁ + p₂ + ...)',
      'Moda: valor que mais se repete na tabela ou pico do gráfico',
      'Desvio Padrão / Variância: quanto MENOR, mais REGULAR/homogêneo é o candidato ou atleta',
      'Probabilidade: P(A) = Casos Favoráveis / Total de Casos Possíveis',
    ],
    goldenTip:
      'Se a questão falar em "mais regular", "mais constante" ou "menor oscilação", você não precisa calcular a raiz do desvio padrão: basta escolher o conjunto cujos valores estão mais próximos da média!',
  },
  {
    id: 'flash-mt-geometria',
    discipline: 'matematica',
    subject: 'Geometria Plana e Espacial',
    title: 'Áreas, Cilindros, Cones, Prismas e Projeção Ortogonal',
    incidence: 'Altíssima · ~22% da prova',
    incidencePercent: 92,
    examDay: '2º Dia',
    summary:
      'Foco em reservatórios de água (cilindros e paralelepípedos), telhados (triângulos/trapézios) e a sombra/rastro de objetos no plano (projeção ortogonal).',
    visualDiagram: [
      { step: 'Tem ponta? (Cone / Pirâmide)', detail: 'Divide por 3 -> V = (Área da Base × h) / 3' },
      { step: 'Não tem ponta? (Cilindro / Prisma)', detail: 'Direto -> V = Área da Base × h' },
      { step: 'Esfera', detail: 'V = (4/3) · π · R³  |  Área = 4 · π · R²' },
    ],
    keyFormulas: [
      'Volume do Cilindro: V = π · r² · h',
      'Área do Círculo: A = π · r²  |  Comprimento da Circunferência: C = 2 · π · r',
      'Triângulo Equilátero: Área = (L² · √3) / 4  |  Altura = (L · √3) / 2',
      'Teorema de Pitágoras: a² = b² + c² (triângulos mágicos: 3-4-5 e 5-12-13)',
    ],
    goldenTip:
      'Em questões de Projeção Ortogonal, imagine uma lanterna iluminando de cima para baixo (perpendicular ao chão): deslocamentos apenas verticais viram um único ponto na sombra!',
  },
  {
    id: 'flash-mt-funcoes',
    discipline: 'matematica',
    subject: 'Funções & Matemática Financeira',
    title: 'Função de 1º e 2º Grau, Exponencial e Juros',
    incidence: 'Alta · ~15% da prova',
    incidencePercent: 84,
    examDay: '2º Dia',
    summary:
      'Função afim cai em tarifas fixas + variáveis; quadrática cai em lucro máximo/altura máxima (vértice da parábola); exponencial cai em meia-vida e crescimento bacteriano.',
    visualDiagram: [
      { step: 'Pede QUANDO atinge o máximo?', detail: 'Calcule o X do vértice: Xv = -b / (2a)' },
      { step: 'Pede QUAL é o valor máximo?', detail: 'Calcule o Y do vértice: Yv = -Δ / (4a) ou substitua Xv na função' },
      { step: 'Taxa constante por período?', detail: 'Soma fixa = PA / 1º Grau  |  Multiplica = PG / Exponencial' },
    ],
    keyFormulas: [
      'Função do 1º Grau: f(x) = a·x + b (b = valor inicial onde corta o eixo Y; a = taxa de variação)',
      'Vértice da Parábola: Xv = -b / (2a) = (x₁ + x₂) / 2',
      'Juros Simples: M = C · (1 + i·t)  |  Juros Compostos: M = C · (1 + i)ᵗ',
    ],
    goldenTip:
      'Para achar o Xv rapidamente sem usar -b/2a, basta tirar a média aritmética das duas raízes da parábola (onde o gráfico toca o chão)!',
  },

  // ======================== CIÊNCIAS DA NATUREZA (2º DIA) ========================
  {
    id: 'flash-cn-eletrodinamica',
    discipline: 'natureza',
    subject: 'Física · Eletrodinâmica',
    title: 'Circuitos Elétricos, Potência e Consumo de Energia',
    incidence: 'Altíssima · ~25% de Física',
    incidencePercent: 94,
    examDay: '2º Dia',
    summary:
      'Chuveiro elétrico, conta de luz em kWh, fusíveis/disjuntores e associação de lâmpadas em série ou paralelo.',
    visualDiagram: [
      { step: 'Circuito em Paralelo (Casas)', detail: 'Mesma tensão (U igual). Se uma lâmpada queima, as outras continuam acesas!' },
      { step: 'Circuito em Série', detail: 'Mesma corrente (i igual). Se uma queima, apaga tudo.' },
      { step: 'Chuveiro no modo INVERNO', detail: 'Menor resistência (R ↓) -> Maior corrente (i ↑) -> Maior potência (P ↑)' },
    ],
    keyFormulas: [
      '1ª Lei de Ohm: U = R · i',
      'Potência Elétrica: P = U · i = U² / R = R · i²',
      'Consumo de Energia (Conta de Luz): E = P (em kW) × Δt (em horas)',
      'Resistores iguais em paralelo: Req = R / n',
    ],
    goldenTip:
      'Na conta de luz, divida a potência em Watts por 1.000 ANTES de multiplicar pelas horas para já ter o resultado em kWh!',
  },
  {
    id: 'flash-cn-ondulatoria-termologia',
    discipline: 'natureza',
    subject: 'Física · Ondulatória & Termologia',
    title: 'Fenômenos Ondulatórios, Calorimetria e Gases',
    incidence: 'Altíssima · ~30% de Física',
    incidencePercent: 91,
    examDay: '2º Dia',
    summary:
      'Ressonância, difração, refração, efeito Doppler, além de calor sensível ("Q = mcΔT") e calor latente ("Q = mL") em aquecimento solar/panelas.',
    visualDiagram: [
      { step: 'Mudou de meio? (Refração)', detail: 'A FREQUÊNCIA NUNCA MUDA! Muda apenas a velocidade e o comprimento de onda (λ).' },
      { step: 'Contornou obstáculo?', detail: 'Difração (ex.: ouvir alguém atrás do muro ou sinal Wi-Fi passando pela porta).' },
      { step: 'Mudou temperatura vs. estado?', detail: 'Mudou T -> Q = m·c·ΔT (Sensível) | Mudou estado físico -> Q = m·L (Latente)' },
    ],
    keyFormulas: [
      'Equação Fundamental da Ondulatória: v = λ · f',
      'Calor Sensível: Q = m · c · ΔT  |  Calor Latente: Q = m · L',
      'Potência Térmica: Pot = Q / Δt',
    ],
    goldenTip:
      'Panela de pressão cozinha mais rápido porque aumenta a pressão interna, o que AUMENTA a temperatura de ebulição da água (passa de 100 °C para ~120 °C)!',
  },
  {
    id: 'flash-cn-ecologia',
    discipline: 'natureza',
    subject: 'Biologia · Ecologia',
    title: 'Ciclo do Nitrogênio, Eutrofização e Cadeias Alimentares',
    incidence: 'Altíssima · ~32% de Biologia',
    incidencePercent: 96,
    examDay: '2º Dia',
    summary:
      'Conteúdo mais cobrado de Biologia: poluição de rios por esgoto/fertilizantes (eutrofização), bioacumulação de mercúrio e ciclo do nitrogênio/carbono.',
    visualDiagram: [
      { step: '1. Fertilizante/Esgoto no rio', detail: 'Excesso de N e P causa explosão de algas na superfície (floração).' },
      { step: '2. Bloqueio de luz solar', detail: 'Algas do fundo morrem -> bactérias aeróbicas proliferam para decompor.' },
      { step: '3. Queda do O₂ dissolvido', detail: 'Bactérias consomem todo o O₂ -> morte em massa dos peixes por asfixia!' },
    ],
    keyFormulas: [
      'Fixação (N₂ -> NH₃) -> Nitrosação (NH₃ -> NO₂⁻) -> Nitratação (NO₂⁻ -> NO₃⁻) -> Desnitrificação (NO₃⁻ -> N₂)',
      'Fluxo de Energia: unidirecional e diminui a cada nível trófico (pirâmide de energia nunca é invertida)',
      'Magnificação Trófica: maior concentração de toxinas/metais pesados no predador de TOPO',
    ],
    goldenTip:
      'Rotação de culturas com leguminosas (soja, feijão) enriquece o solo naturalmente com nitrogênio graças às bactérias Rhizobium nas raízes!',
  },
  {
    id: 'flash-cn-quimica',
    discipline: 'natureza',
    subject: 'Química · Orgânica, Interações & Estequiometria',
    title: 'Polaridade, Funções Orgânicas, Eletroquímica e pH',
    incidence: 'Altíssima · ~35% de Química',
    incidencePercent: 93,
    examDay: '2º Dia',
    summary:
      'Solubilidade ("semelhante dissolve semelhante"), sabão/detergente (anfifílico), pilhas ("CRAO"), hidrólise de sais e cálculo estequiométrico.',
    visualDiagram: [
      { step: 'Hidrocarbonetos (só C e H)', detail: 'Apolares / Lipofílicos -> dissolvem em óleo/gordura, NÃO em água.' },
      { step: 'Com grupos -OH, -COOH, -NH₂', detail: 'Fazem Ligação de Hidrogênio -> Polares / Hidrofílicos (solúveis em água).' },
      { step: 'Pilha (Espontânea, ΔE > 0)', detail: 'Cátodo Reduz (ganha e⁻, maior E°) | Ânodo Oxida (perde e⁻, corrói).' },
    ],
    keyFormulas: [
      'Pilha: ΔE° = E°(maior / redução) - E°(menor / oxidação)',
      'Solo ácido + Calagem: usa-se CaCO₃ ou CaO (óxidos/sais básicos) para elevar o pH',
      'Sabão/Detergente: cauda apolar (prende na gordura) + cabeça polar/iônica (interage com a água)',
    ],
    goldenTip:
      'Para saber se uma vitamina ou agrotóxico acumula na gordura ou sai na urina: conte as hidroxilas (-OH). Muitas hidroxilas = hidrossolúvel (sai na urina); cadeia carbônica longa sem -OH = lipossolúvel (acumula no tecido adiposo)!',
  },

  // ======================== REDAÇÃO & LINGUAGENS (1º DIA) ========================
  {
    id: 'flash-red-esqueleto',
    discipline: 'redacao',
    subject: 'Redação · Estrutura Nota 1000',
    title: 'Esqueleto Coringa + Repertórios + 5 Elementos (C5)',
    incidence: 'Peso máximo · até 1000 pontos',
    incidencePercent: 100,
    examDay: '1º Dia',
    summary:
      'Modelo pronto de 4 parágrafos com conectivos, repertórios socioculturais coringas (Constituição de 1988, Bauman, Milton Santos) e checklist da Competência 5.',
    visualDiagram: [
      { step: 'Introdução (6-7 linhas)', detail: 'Constituição de 1988 garante [direito], mas na prática falha por [A1: negligência estatal] e [A2: invisibilidade social].' },
      { step: 'D1 e D2 (7-8 linhas cada)', detail: 'Tópico frasal + Repertório (Gilberto Dimenstein / Zygmunt Bauman / Silvio Almeida) + relação direta com o tema.' },
      { step: 'Conclusão C5 (7-8 linhas)', detail: 'Portanto + Agente + Ação + Meio/Modo ("por meio de...") + Efeito ("a fim de...") + Detalhamento.' },
    ],
    keyFormulas: [
      'Repertório Coringa 1: "Cidadão de Papel" (Gilberto Dimenstein) — direitos existem na lei (CF/88), mas não se concretizam na prática.',
      'Repertório Coringa 2: "Modernidade Líquida" (Zygmunt Bauman) — individualismo e apatia diante de problemas coletivos.',
      'Checklist C5: 1. Agente (Ministério...) | 2. Ação (deve promover...) | 3. Meio (por meio de...) | 4. Efeito (com o fito de...) | 5. Detalhamento (explicação entre travessões).',
    ],
    goldenTip:
      'NUNCA esqueça de colocar um conectivo interparágrafo no início do D2 ("Ademais," / "Outrossim,") e no início da Conclusão ("Portanto," / "Destarte,") para garantir os 200 pontos da Competência 4!',
  },
  {
    id: 'flash-lc-funcoes',
    discipline: 'linguagens',
    subject: 'Linguagens · Interpretação & Gramática',
    title: 'Funções da Linguagem, Variação Linguística e Gêneros',
    incidence: 'Altíssima · ~35% de Linguagens',
    incidencePercent: 93,
    examDay: '1º Dia',
    summary:
      'As 6 funções da linguagem, campanhas publicitárias, patrimônio linguístico (combate ao preconceito linguístico) e movimentos literários (Modernismo).',
    visualDiagram: [
      { step: 'Conativa / Apelativa', detail: 'Foco no leitor (verbos no imperativo: "Compre", "Vacine-se") -> propagandas e campanhas.' },
      { step: 'Metalinguística', detail: 'O código explica o próprio código (poema sobre fazer poesia, dicionário).' },
      { step: 'Referencial / Denotativa', detail: 'Informação objetiva, impessoal, 3ª pessoa -> notícias e textos científicos.' },
    ],
    keyFormulas: [
      'Emotiva (1ª pessoa, subjetiva) | Fática (testa o canal: "Alô?", "Né?") | Poética (ritmo, sonoridade e estética)',
      'Variação Linguística: NÃO existe jeito "errado" de falar; existe adequação ao contexto comunicativo',
      '1ª Fase Modernista (1922): nacionalismo crítico, língua falada, verso livre (Oswald e Mário de Andrade)',
    ],
    goldenTip:
      'Em questões sobre Variação Linguística, descarte qualquer alternativa que chame o falar regional de "empobrecido" ou "incorreto". A resposta certa sempre valoriza a identidade cultural do falante!',
  },

  // ======================== CIÊNCIAS HUMANAS (1º DIA) ========================
  {
    id: 'flash-ch-brasil',
    discipline: 'humanas',
    subject: 'História do Brasil & Cidadania',
    title: 'Era Vargas, Patrimônio Cultural, Escravidão e República',
    incidence: 'Altíssima · ~30% de Humanas',
    incidencePercent: 92,
    examDay: '1º Dia',
    summary:
      'Trabalhismo e propaganda no Estado Novo (DIP), resistência negra/indígena, patrimônio imaterial (IPHAN) e redemocratização (Constituição de 1988).',
    visualDiagram: [
      { step: 'Colônia & Império', detail: 'Agromanufatura açucareira, mineração, resistência quilombola e abolição sem inclusão social (1888).' },
      { step: 'Era Vargas (1930–1945)', detail: 'Industrialização de base (CSN/Vale), CLT (1943), controle sindical e propaganda no rádio (DIP).' },
      { step: 'Patrimônio Imaterial', detail: 'Saberes, festas, culinária e modos de fazer (frevo, queijo minas, capoeira) preservam a memória coletiva.' },
    ],
    keyFormulas: [
      'Cidadania no ENEM: conquista histórica dos movimentos sociais, não "presente" benevolente do Estado',
      'Democracia Grega (Atenas) vs. Moderna: Atenas era direta mas excludente (mulheres, escravos e estrangeiros de fora)',
    ],
    goldenTip:
      'Sempre que uma questão de Humanas trouxer uma manifestação popular (samba, maracatu, culinária), a resposta correta aponta para "preservação da memória, identidade e resistência cultural"!',
  },
  {
    id: 'flash-ch-geografia',
    discipline: 'humanas',
    subject: 'Geografia & Filosofia',
    title: 'Agronegócio, Urbanização, Clima/Solos e Ética',
    incidence: 'Altíssima · ~34% de Humanas',
    incidencePercent: 94,
    examDay: '1º Dia',
    summary:
      'Expansão da fronteira agrícola, ilhas de calor, inversão térmica, intemperismo/lixiviação de solos, globalização (Milton Santos) e Contratualistas.',
    visualDiagram: [
      { step: 'Ilha de Calor vs. Inversão Térmica', detail: 'Ilha de calor = concreto/asfalto retém calor | Inversão = ar frio preso embaixo no inverno retém poluentes.' },
      { step: 'Amazônia & Solos', detail: 'Solo amazônico é raso e pobre (lixiviado pelas chuvas); sua fertilidade depende da serrapilheira da própria floresta!' },
      { step: 'Contratualistas', detail: 'Hobbes (Estado forte garante paz) | Locke (propriedade e direitos naturais) | Rousseau (vontade geral).' },
    ],
    keyFormulas: [
      'Intemperismo Químico: predomina em climas quentes e úmidos (ação da água)',
      'Intemperismo Físico: predomina em climas áridos/semiáridos como a Caatinga (variação térmica)',
      'Revolução Verde: mecanização no campo -> aumento de produtividade + êxodo rural + concentração fundiária',
    ],
    goldenTip:
      'Nas questões de Geografia Física sobre enchentes urbanas, a causa principal no gabarito do ENEM é sempre a "impermeabilização do solo que reduz a infiltração e aumenta o escoamento superficial"!',
  },
];
