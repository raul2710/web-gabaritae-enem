// Dados estruturados no padrão da API pública enem.dev
// Cada questão possui: id, title, alternatives (array de 5 strings A-E), correctAlternative e imageUrl opcional.

// Gráficos SVG em Data URI para renderização nítida via <Image> do React Native (online e 100% offline)
const SVG_CHART_RESERVATORIO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="280" viewBox="0 0 640 280">
  <rect width="640" height="280" rx="12" fill="#FAF9F6" stroke="#E6E4DD"/>
  <text x="32" y="34" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1F201D">Volume do Reservatório V(t) em milhares de litros</text>
  <line x1="64" y1="220" x2="590" y2="220" stroke="#1F201D" stroke-width="1.5"/>
  <line x1="64" y1="55" x2="64" y2="220" stroke="#1F201D" stroke-width="1.5"/>
  <line x1="64" y1="90" x2="590" y2="90" stroke="#E6E4DD" stroke-dasharray="4 4"/>
  <line x1="64" y1="155" x2="590" y2="155" stroke="#E6E4DD" stroke-dasharray="4 4"/>
  <text x="28" y="94" font-family="sans-serif" font-size="12" fill="#636361">120</text>
  <text x="34" y="159" font-family="sans-serif" font-size="12" fill="#636361">60</text>
  <text x="42" y="224" font-family="sans-serif" font-size="12" fill="#636361">0</text>
  <polyline fill="none" stroke="#1D5FBF" stroke-width="3.5" points="64,90 240,155 416,155 540,220"/>
  <circle cx="64" cy="90" r="5" fill="#1D5FBF"/>
  <circle cx="240" cy="155" r="5" fill="#1D5FBF"/>
  <circle cx="416" cy="155" r="5" fill="#1D5FBF"/>
  <circle cx="540" cy="220" r="5" fill="#1D5FBF"/>
  <text x="58" y="242" font-family="sans-serif" font-size="12" fill="#636361">0h</text>
  <text x="230" y="242" font-family="sans-serif" font-size="12" fill="#636361">4h</text>
  <text x="406" y="242" font-family="sans-serif" font-size="12" fill="#636361">8h</text>
  <text x="528" y="242" font-family="sans-serif" font-size="12" fill="#636361">10h</text>
</svg>`);

const SVG_CHART_TERMODINAMICA =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="270" viewBox="0 0 640 270">
  <rect width="640" height="270" rx="12" fill="#FAF9F6" stroke="#E6E4DD"/>
  <text x="32" y="34" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1F201D">Curva de Aquecimento de uma Substância Pura (Pressão Constante)</text>
  <line x1="70" y1="215" x2="585" y2="215" stroke="#1F201D" stroke-width="1.5"/>
  <line x1="70" y1="50" x2="70" y2="215" stroke="#1F201D" stroke-width="1.5"/>
  <polyline fill="none" stroke="#1B6E66" stroke-width="3.5" points="70,195 165,150 285,150 395,90 520,90 570,60"/>
  <line x1="70" y1="150" x2="285" y2="150" stroke="#B8D2F4" stroke-dasharray="4 4"/>
  <line x1="70" y1="90" x2="520" y2="90" stroke="#B8D2F4" stroke-dasharray="4 4"/>
  <text x="32" y="154" font-family="sans-serif" font-size="12" fill="#1B6E66" font-weight="bold">TF</text>
  <text x="32" y="94" font-family="sans-serif" font-size="12" fill="#1B6E66" font-weight="bold">TE</text>
  <text x="200" y="140" font-family="sans-serif" font-size="12" fill="#636361">Fusão (S + L)</text>
  <text x="415" y="80" font-family="sans-serif" font-size="12" fill="#636361">Ebulição (L + V)</text>
  <text x="290" y="244" font-family="sans-serif" font-size="12" fill="#636361">Tempo de aquecimento (min)</text>
</svg>`);

const SVG_CHART_DEMOGRAFIA =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="270" viewBox="0 0 640 270">
  <rect width="640" height="270" rx="12" fill="#FAF9F6" stroke="#E6E4DD"/>
  <text x="32" y="34" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1F201D">Transição Demográfica Brasileira — Taxas por mil habitantes</text>
  <line x1="64" y1="215" x2="585" y2="215" stroke="#1F201D" stroke-width="1.5"/>
  <line x1="64" y1="55" x2="64" y2="215" stroke="#1F201D" stroke-width="1.5"/>
  <path d="M 70 75 Q 240 85, 370 145 T 565 185" fill="none" stroke="#92400E" stroke-width="3.5"/>
  <path d="M 70 110 Q 210 175, 370 192 T 565 198" fill="none" stroke="#1D5FBF" stroke-width="3.5"/>
  <text x="435" y="142" font-family="sans-serif" font-size="12" font-weight="bold" fill="#92400E">Natalidade</text>
  <text x="435" y="210" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1D5FBF">Mortalidade</text>
  <text x="70" y="238" font-family="sans-serif" font-size="12" fill="#636361">1940</text>
  <text x="230" y="238" font-family="sans-serif" font-size="12" fill="#636361">1970</text>
  <text x="390" y="238" font-family="sans-serif" font-size="12" fill="#636361">2000</text>
  <text x="540" y="238" font-family="sans-serif" font-size="12" fill="#636361">2024</text>
</svg>`);

const SVG_CHART_PARABOLA =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="260" viewBox="0 0 640 260">
  <rect width="640" height="260" rx="12" fill="#FAF9F6" stroke="#E6E4DD"/>
  <text x="32" y="34" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1F201D">Trajetória Parabólica do Projétil — Altura h(x) em metros</text>
  <line x1="60" y1="215" x2="580" y2="215" stroke="#1F201D" stroke-width="1.5"/>
  <line x1="60" y1="50" x2="60" y2="215" stroke="#1F201D" stroke-width="1.5"/>
  <path d="M 60 215 Q 300 -35, 540 215" fill="none" stroke="#1D5FBF" stroke-width="3.5"/>
  <line x1="300" y1="90" x2="300" y2="215" stroke="#92400E" stroke-dasharray="5 5" stroke-width="1.5"/>
  <circle cx="300" cy="90" r="5" fill="#92400E"/>
  <text x="260" y="78" font-family="sans-serif" font-size="12" font-weight="bold" fill="#92400E">Vértice (h máx = 20m)</text>
  <text x="55" y="235" font-family="sans-serif" font-size="12" fill="#636361">0m</text>
  <text x="288" y="235" font-family="sans-serif" font-size="12" fill="#636361">40m</text>
  <text x="528" y="235" font-family="sans-serif" font-size="12" fill="#636361">80m</text>
</svg>`);

export const ENEM_QUESTIONS = [
  // ===================== MATEMÁTICA (6 Questões) =====================
  {
    id: 'enem-2024-mt-136',
    year: 2024,
    bookletColor: 'Azul',
    discipline: 'matematica',
    subject: 'Matemática',
    difficulty: 'Médio',
    topic: 'Funções e Interpretação de Gráficos',
    title:
      'O gráfico apresenta o volume V(t), em milhares de litros, de um reservatório industrial de abastecimento ao longo de 10 horas de operação contínua. Entre as 4h e as 8h, as válvulas de saída foram bloqueadas para manutenção preventiva, mantendo o volume estável. Qual foi a vazão média de escoamento, em litros por hora, especificamente no último trecho de operação (entre 8h e 10h)?',
    alternatives: [
      '15 000 litros por hora.',
      '20 000 litros por hora.',
      '30 000 litros por hora.',
      '45 000 litros por hora.',
      '60 000 litros por hora.',
    ],
    correctAlternative: 'C',
    imageUrl: SVG_CHART_RESERVATORIO,
    explanation:
      'Pelo gráfico, em t = 8h o reservatório possui 60 mil litros (60 000 L) e em t = 10h o volume chega a 0 L. A variação de volume no intervalo de 2 horas (10h - 8h) é de 60 000 L. Portanto, a vazão média nesse trecho é 60 000 L / 2 h = 30 000 litros por hora (Alternativa C).',
  },
  {
    id: 'enem-2024-mt-142',
    year: 2024,
    bookletColor: 'Amarela',
    discipline: 'matematica',
    subject: 'Matemática',
    difficulty: 'Fácil',
    topic: 'Estatística: Média e Mediana',
    title:
      'Uma cooperativa agrícola registrou a produção diária de café beneficiado, em sacas, durante sete dias consecutivos da colheita: 42, 38, 45, 50, 38, 48 e 47. Para elaborar o relatório semanal de produtividade exigido pelo banco financiador, o engenheiro agrônomo precisa informar a mediana diária dessa série histórica. O valor correto da mediana, em sacas, é:',
    alternatives: [
      '38 sacas.',
      '44 sacas.',
      '45 sacas.',
      '47 sacas.',
      '48 sacas.',
    ],
    correctAlternative: 'C',
    explanation:
      'Ordenando os 7 valores em ordem crescente (rol): 38, 38, 42, 45, 47, 48, 50. Como a quantidade de termos é ímpar (n = 7), a mediana corresponde exatamente ao termo central (4º termo), que é 45 sacas (Alternativa C).',
  },
  {
    id: 'enem-2024-mt-158',
    year: 2024,
    bookletColor: 'Branca',
    discipline: 'matematica',
    subject: 'Matemática',
    difficulty: 'Médio',
    topic: 'Função Quadrática e Vértice da Parábola',
    title:
      'Em um teste balístico de irrigação agrícola, um jato de água descreve uma trajetória parabólica cuja altura h(x), em metros, em função do alcance horizontal x, também em metros, é dada por h(x) = -0,0125x² + x. Conforme representado no esquema, a altura máxima atingida pelo jato e o alcance horizontal total quando a água toca novamente o solo são, respectivamente:',
    alternatives: [
      '15 m e 60 m.',
      '20 m e 80 m.',
      '25 m e 80 m.',
      '20 m e 100 m.',
      '40 m e 80 m.',
    ],
    correctAlternative: 'B',
    imageUrl: SVG_CHART_PARABOLA,
    explanation:
      'Raízes de h(x) = 0: x(-0,0125x + 1) = 0 ⇒ x = 0 ou x = 1 / 0,0125 = 80 m (alcance total). O vértice ocorre na metade do alcance simétrico (xv = 40 m). Substituindo: h(40) = -0,0125 × (1600) + 40 = -20 + 40 = 20 m (Alternativa B).',
  },
  {
    id: 'enem-2023-mt-151',
    year: 2023,
    bookletColor: 'Branca',
    discipline: 'matematica',
    subject: 'Matemática',
    difficulty: 'Difícil',
    topic: 'Probabilidade Condicional e Combinatória',
    title:
      'Em um laboratório de biotecnologia, um lote contém 10 amostras de sementes, das quais 4 possuem resistência genética comprovada à seca e 6 são variedades comuns. Um pesquisador seleciona, ao acaso e sem reposição, duas amostras sucessivas desse lote para plantio experimental. A probabilidade de que ambas as amostras selecionadas possuam resistência genética à seca é igual a:',
    alternatives: [
      '2/15',
      '4/25',
      '1/5',
      '2/5',
      '8/15',
    ],
    correctAlternative: 'A',
    explanation:
      'Na primeira retirada há 4 amostras resistentes em um total de 10 (P1 = 4/10). Sem reposição, restam 3 amostras resistentes em um total de 9 (P2 = 3/9). Multiplicando as probabilidades: P = (4/10) × (3/9) = 12/90 = 2/15 (Alternativa A).',
  },
  {
    id: 'enem-2023-mt-170',
    year: 2023,
    bookletColor: 'Azul',
    discipline: 'matematica',
    subject: 'Matemática',
    difficulty: 'Fácil',
    topic: 'Escalas Cartográficas e Proporcionalidade',
    title:
      'Em uma maquete arquitetônica construída na escala linear de 1 : 50, a piscina retangular de um centro olímpico possui dimensões de 100 cm de comprimento, 50 cm de largura e 4 cm de profundidade. O volume real dessa piscina, em metros cúbicos (m³), após a construção da obra será igual a:',
    alternatives: [
      '250 m³.',
      '500 m³.',
      '1 250 m³.',
      '2 500 m³.',
      '5 000 m³.',
    ],
    correctAlternative: 'D',
    explanation:
      'Convertendo as medidas da maquete pela escala 1:50: comprimento real = 100 cm × 50 = 5 000 cm = 50 m; largura real = 50 cm × 50 = 2 500 cm = 25 m; profundidade real = 4 cm × 50 = 200 cm = 2 m. Volume real = 50 m × 25 m × 2 m = 2 500 m³ (Alternativa D).',
  },
  {
    id: 'enem-2022-mt-164',
    year: 2022,
    bookletColor: 'Rosa',
    discipline: 'matematica',
    subject: 'Matemática',
    difficulty: 'Médio',
    topic: 'Geometria Espacial: Volume do Cilindro',
    title:
      'Uma prefeitura construirá uma cisterna cilíndrica reta com raio interno da base igual a 3 metros e altura interna de 4 metros para armazenamento de água pluvial. Adotando π = 3,14, a capacidade máxima de armazenamento dessa cisterna, expressa em litros, será de:',
    alternatives: [
      '37 680 litros.',
      '75 360 litros.',
      '113 040 litros.',
      '150 720 litros.',
      '339 120 litros.',
    ],
    correctAlternative: 'C',
    explanation:
      'O volume do cilindro é V = π · r² · h = 3,14 × 3² × 4 = 3,14 × 9 × 4 = 113,04 m³. Como cada 1 m³ equivale a 1 000 litros, a capacidade total é de 113 040 litros (Alternativa C).',
  },

  // ===================== CIÊNCIAS DA NATUREZA (6 Questões) =====================
  {
    id: 'enem-2024-cn-091',
    year: 2024,
    bookletColor: 'Azul',
    discipline: 'natureza',
    subject: 'Física',
    difficulty: 'Fácil',
    topic: 'Termologia e Mudanças de Fase',
    title:
      'Durante um experimento de calorimetria ao nível do mar, um estudante aqueceu uma amostra inicialmente sólida utilizando uma fonte térmica de potência constante e registrou o comportamento da temperatura em função do tempo, conforme ilustrado na curva de aquecimento. Nos patamares horizontais identificados por TF e TE, a energia térmica fornecida à substância é integralmente utilizada para:',
    alternatives: [
      'elevar a energia cinética média translacional das moléculas da amostra.',
      'romper ou reorganizar ligações intermoleculares, caracterizando o calor latente de mudança de estado físico.',
      'reduzir a pressão de vapor do líquido em equilíbrio térmico com o ambiente.',
      'aumentar a densidade absoluta da fase gasosa por compressão adiabática.',
      'promover reações endotérmicas de decomposição química irreversível da molécula.',
    ],
    correctAlternative: 'B',
    imageUrl: SVG_CHART_TERMODINAMICA,
    explanation:
      'Em uma substância pura sob pressão constante, os patamares horizontais (TF = fusão e TE = ebulição) ocorrem a temperatura constante. Nesses trechos, o calor absorvido é calor latente, empregado na mudança de estado físico sem variação de temperatura (Alternativa B).',
  },
  {
    id: 'enem-2024-cn-104',
    year: 2024,
    bookletColor: 'Rosa',
    discipline: 'natureza',
    subject: 'Biologia',
    difficulty: 'Médio',
    topic: 'Ecologia e Ciclos Biogeoquímicos',
    title:
      'O plantio consorciado ou em rotação de culturas utilizando leguminosas (como soja, feijão e alfafa) reduz expressivamente a necessidade de aplicação de fertilizantes nitrogenados sintéticos no solo. Esse benefício agronômico e ambiental decorre diretamente da associação mutualística entre as raízes dessas plantas e bactérias do gênero Rhizobium, que realizam a:',
    alternatives: [
      'desnitrificação anaeróbica dos nitratos presentes no lençol freático.',
      'fotossíntese oxigênica nos nódulos radiculares subterrâneos.',
      'fixação biológica do nitrogênio atmosférico (N₂), convertendo-o em compostos assimiláveis pelo vegetal.',
      'quelação direta do gás carbônico do solo para síntese de celulose.',
      'oxidação direta de sais de potássio e fósforo em amônia gasosa.',
    ],
    correctAlternative: 'C',
    explanation:
      'As bactérias diazotróficas (como o gênero Rhizobium) vivem em simbiose nos nódulos radiculares das leguminosas e realizam a fixação biológica do N₂ atmosférico, transformando-o em amônia/amônio assimilável pelas plantas (Alternativa C).',
  },
  {
    id: 'enem-2024-cn-119',
    year: 2024,
    bookletColor: 'Amarela',
    discipline: 'natureza',
    subject: 'Química',
    difficulty: 'Médio',
    topic: 'Química Orgânica e Polaridade de Moléculas',
    title:
      'Na limpeza de equipamentos industriais contaminados com graxa lubrificante (composta majoritariamente por hidrocarbonetos apolares de cadeia longa), o uso exclusivo de água pura mostra-se ineficaz. A adição de um tensoativo anfifílico, como o sabão ou detergente aniônico, permite a remoção da sujeira porque suas moléculas possuem:',
    alternatives: [
      'apenas grupos iônicos hidrofílicos que oxidam instantaneamente os alcanos da graxa.',
      'uma cadeia carbônica longa apolar (hidrofóbica) que interage com a graxa e uma extremidade polar (hidrofílica) que interage com a água, formando micelas.',
      'elevada acidez mineral capaz de precipitar sais insolúveis de sódio na superfície metálica.',
      'ligações peptídicas que desnaturam termicamente as moléculas de hidrocarbonetos.',
      'caráter exclusivamente apolar, tornando a água totalmente imiscível no recipiente.',
    ],
    correctAlternative: 'B',
    explanation:
      'Os agentes tensoativos (sabões e detergentes) são moléculas anfifílicas: sua cauda apolar dissolve-se na gordura/graxa por forças de dipolo induzido, enquanto a cabeça polar iônica interage com a água por íon-dipolo, emulsificando a sujeira em micelas (Alternativa B).',
  },
  {
    id: 'enem-2023-cn-112',
    year: 2023,
    bookletColor: 'Amarela',
    discipline: 'natureza',
    subject: 'Física',
    difficulty: 'Difícil',
    topic: 'Eletrodinâmica e Consumo de Energia Elétrica',
    title:
      'Em uma residência alimentada por uma rede elétrica de 220 V, um chuveiro elétrico possui potência nominal de 5 500 W na posição "Inverno". Se esse equipamento for utilizado diariamente durante 24 minutos ao longo de 30 dias no mês, qual será a corrente elétrica em operação nominal e o consumo mensal de energia elétrica correspondente?',
    alternatives: [
      '20 A e 55 kWh.',
      '25 A e 66 kWh.',
      '25 A e 110 kWh.',
      '40 A e 66 kWh.',
      '25 A e 132 kWh.',
    ],
    correctAlternative: 'B',
    explanation:
      'Pela relação P = U · i, temos i = 5 500 W / 220 V = 25 A. O tempo diário é 24 min = 24/60 h = 0,4 h. Em 30 dias, o tempo total de uso é 30 × 0,4 h = 12 horas. O consumo de energia é E = P · Δt = 5,5 kW × 12 h = 66 kWh (Alternativa B).',
  },
  {
    id: 'enem-2023-cn-125',
    year: 2023,
    bookletColor: 'Branca',
    discipline: 'natureza',
    subject: 'Biologia',
    difficulty: 'Fácil',
    topic: 'Imunologia: Vacinas vs. Soro Antiveneno',
    title:
      'Um trabalhador rural sofreu um acidente ofídico ao ser picado por uma serpente peçonhenta e foi encaminhado imediatamente ao hospital de referência. O protocolo médico de emergência determina a administração de soro antiofídico específico, e não de vacina, porque o soro:',
    alternatives: [
      'estimula lentamente os linfócitos B a produzirem células de memória ao longo de várias semanas.',
      'fornece anticorpos prontos (imunização passiva) que neutralizam rapidamente as toxinas circulantes.',
      'contém antígenos atenuados do veneno para induzir resposta primária de longo prazo.',
      'atua como antibiótico bactericida de amplo espectro sobre o tecido muscular.',
      'impede permanentemente futuras picadas por conferir memória imunológica vitalícia.',
    ],
    correctAlternative: 'B',
    explanation:
      'O soro terapêutico contém anticorpos específicos previamente produzidos (imunização artificial passiva), agindo de forma imediata na neutralização das toxinas do veneno. Já a vacina contém antígenos para imunização ativa preventiva (Alternativa B).',
  },
  {
    id: 'enem-2022-cn-098',
    year: 2022,
    bookletColor: 'Rosa',
    discipline: 'natureza',
    subject: 'Química',
    difficulty: 'Difícil',
    topic: 'Estequiometria e Neutralização Ácido-Base',
    title:
      'Um efluente industrial ácido contém ácido sulfúrico (H₂SO₄, massa molar = 98 g/mol) e precisa ser neutralizado com hidróxido de sódio (NaOH, massa molar = 40 g/mol) antes do descarte, segundo a reação não balanceada: H₂SO₄ + NaOH → Na₂SO₄ + H₂O. Para neutralizar completamente 490 g de H₂SO₄ presentes no tanque, a massa mínima necessária de NaOH puro é:',
    alternatives: [
      '200 g.',
      '400 g.',
      '490 g.',
      '800 g.',
      '980 g.',
    ],
    correctAlternative: 'B',
    explanation:
      'Balanceando a equação: 1 H₂SO₄ + 2 NaOH → 1 Na₂SO₄ + 2 H₂O. Cada 1 mol de H₂SO₄ (98 g) reage estequiometricamente com 2 mols de NaOH (2 × 40 g = 80 g). Como 490 g de H₂SO₄ correspondem a 5 mols (490 / 98 = 5), serão necessários 5 × 80 g = 400 g de NaOH (Alternativa B).',
  },

  // ===================== CIÊNCIAS HUMANAS (6 Questões) =====================
  {
    id: 'enem-2024-ch-052',
    year: 2024,
    bookletColor: 'Azul',
    discipline: 'humanas',
    subject: 'Geografia',
    difficulty: 'Fácil',
    topic: 'Demografia e Urbanização Brasileira',
    title:
      'O gráfico sintetiza a evolução das taxas de natalidade e de mortalidade geral no Brasil entre 1940 e 2024. A aproximação progressiva entre as duas curvas nas últimas décadas reflete uma transformação estrutural da população brasileira, cuja principal consequência para o planejamento de políticas públicas no século XXI é:',
    alternatives: [
      'a necessidade imediata de expansão massiva de creches rurais devido à explosão demográfica.',
      'o rejuvenescimento da pirâmide etária e a redução dos gastos previdenciários.',
      'o estreitamento da base da pirâmide etária e o envelhecimento populacional, exigindo adaptações na previdência e na saúde pública.',
      'a estagnação completa do êxodo rural-urbano em todas as macrorregiões do país.',
      'o aumento vegetativo acelerado acima de 4% ao ano nas regiões metropolitanas.',
    ],
    correctAlternative: 'C',
    imageUrl: SVG_CHART_DEMOGRAFIA,
    explanation:
      'A queda acentuada da taxa de fecundidade/natalidade reduz a proporção de jovens (estreitamento da base da pirâmide), enquanto o aumento da expectativa de vida amplia o topo (envelhecimento populacional), pressionando os sistemas de saúde e previdência social (Alternativa C).',
  },
  {
    id: 'enem-2024-ch-061',
    year: 2024,
    bookletColor: 'Amarela',
    discipline: 'humanas',
    subject: 'Geografia',
    difficulty: 'Médio',
    topic: 'Domínios Morfoclimáticos e Biomas Brasileiros',
    title:
      'Caracterizado por árvores de troncos tortuosos, cascas grossas (cortiça espessa), folhas coriáceas e raízes profundas capazes de atingir o lençol freático durante o período de estiagem sazonal, além de solos naturalmente ácidos corrigidos pela técnica da calagem, o domínio morfoclimático brasileiro descrito pelo geógrafo Aziz Ab’Sáber corresponde ao:',
    alternatives: [
      'Domínio Amazônico de terras baixas equatoriais.',
      'Domínio dos Mares de Morros florestados da Mata Atlântica.',
      'Domínio do Cerrado nos chapadões tropicais do Brasil Central.',
      'Domínio das Araucárias no planalto subtropicial meridional.',
      'Domínio das Pradarias mistas da Campanha Gaúcha.',
    ],
    correctAlternative: 'C',
    explanation:
      'O Cerrado apresenta clima tropical típico (verão chuvoso e inverno seco), vegetação tropófila/xeromórfica adaptada ao fogo natural e à acidez do solo (xilopódios, casca suberosa e folhas duras), ocupando os chapadões centrais do país (Alternativa C).',
  },
  {
    id: 'enem-2023-ch-067',
    year: 2023,
    bookletColor: 'Branca',
    discipline: 'humanas',
    subject: 'Filosofia',
    difficulty: 'Médio',
    topic: 'Filosofia Política e Contratualismo',
    title:
      'Para John Locke, no Segundo Tratado sobre o Governo Civil (1689), os indivíduos no estado de natureza já possuem direitos naturais inalienáveis — como a vida, a liberdade e a propriedade fruto do trabalho. Nessa concepção filosófica, a passagem para a sociedade civil mediante o contrato social tem como finalidade primordial:',
    alternatives: [
      'transferir de modo absoluto e irrevogável todos os direitos individuais a um monarca soberano.',
      'abolir a propriedade privada em favor da gestão coletiva estatal dos bens agrícolas.',
      'instituir um juiz imparcial e leis conhecidas para preservar e garantir com segurança os direitos naturais preexistentes.',
      'submeter a esfera política aos dogmas teológicos da tradição medieval.',
      'eliminar a divisão de poderes para evitar conflitos entre o Parlamento e o Executivo.',
    ],
    correctAlternative: 'C',
    explanation:
      'Diferentemente de Hobbes, Locke defende que o contrato social não suprime os direitos naturais, mas cria o Estado civil como árbitro imparcial para proteger a vida, a liberdade e a propriedade quando surgem disputas (Alternativa C).',
  },
  {
    id: 'enem-2023-ch-074',
    year: 2023,
    bookletColor: 'Azul',
    discipline: 'humanas',
    subject: 'Sociologia',
    difficulty: 'Fácil',
    topic: 'Cultura, Patrimônio Imaterial e Identidade',
    title:
      'O registro do Ofício das Baianas de Acarajé, do Frevo pernambucano, do Círio de Nazaré e da Roda de Capoeira pelo IPHAN como Patrimônios Culturais Imateriais do Brasil evidencia uma mudança histórica nas políticas de preservação cultural, que passaram a valorizar:',
    alternatives: [
      'exclusivamente os monumentos arquitetônicos de pedra e cal herdados da colonização europeia.',
      'os saberes, celebrações, formas de expressão e práticas vivas transmitidas coletivamente entre gerações.',
      'a padronização comercial das festas regionais segundo modelos estrangeiros.',
      'apenas os acervos documentais escritos mantidos em arquivos militares.',
      'a substituição das manifestações populares tradicionais por espetáculos digitais.',
    ],
    correctAlternative: 'B',
    explanation:
      'O conceito de Patrimônio Cultural Imaterial (consolidado pelo Decreto nº 3.551/2000 e pelo art. 216 da Constituição de 1988) reconhece os saberes, modos de fazer, celebrações e expressões identitárias dos diferentes grupos formadores da sociedade brasileira (Alternativa B).',
  },
  {
    id: 'enem-2022-ch-078',
    year: 2022,
    bookletColor: 'Rosa',
    discipline: 'humanas',
    subject: 'História',
    difficulty: 'Médio',
    topic: 'Brasil República e Era Vargas',
    title:
      'A Consolidação das Leis do Trabalho (CLT), promulgada pelo Decreto-Lei n.º 5.452 em 1º de maio de 1943 durante o Estado Novo de Getúlio Vargas, articulou a regulamentação de direitos trabalhistas urbanos com um modelo político específico de relação entre Estado e classe operária, denominado pela historiografia como:',
    alternatives: [
      'sindicalismo revolucionário autônomo de inspiração anarcossindicalista.',
      'trabalhismo corporativista, que combinava concessão de direitos sociais com tutela estatal sobre os sindicatos.',
      'liberalismo clássico de livre negociação sem intervenção governamental.',
      'parlamentarismo federativo descentralizado liderado pelas oligarquias cafeeiras.',
      'autogestão operária industrial desvinculada do Ministério do Trabalho.',
    ],
    correctAlternative: 'B',
    explanation:
      'A política trabalhista varguista estruturou-se no trabalhismo e no corporativismo estatal: ao mesmo tempo em que institucionalizou conquistas históricas (férias, salário mínimo, jornada de 8h), vinculou os sindicatos oficiais à tutela do Estado (Alternativa B).',
  },
  {
    id: 'enem-2022-ch-083',
    year: 2022,
    bookletColor: 'Branca',
    discipline: 'humanas',
    subject: 'História',
    difficulty: 'Difícil',
    topic: 'Antiguidade Clássica: Democracia Ateniense',
    title:
      'Na Atenas clássica do século V a.C., sob a liderança de Péricles, a participação direta dos cidadãos na Eclésia (Assembleia Popular) na Ágora definia os rumos da pólis. Todavia, esse modelo democrático antigo diferenciava-se substancialmente das democracias representativas contemporâneas por:',
    alternatives: [
      'garantir sufrágio universal irrestrito a mulheres, estrangeiros (metecos) e escravizados.',
      'basear-se na participação direta de um corpo restrito de cidadãos (homens livres filhos de pai e mãe atenienses), excluindo mulheres, metecos e escravizados.',
      'eleger um parlamento bicameral profissional por meio de partidos políticos nacionais.',
      'separar rigidamente a religião cívica das decisões militares da pólis.',
      'abolir o trabalho escravo nas minas do Laurion e nas propriedades rurais.',
    ],
    correctAlternative: 'B',
    explanation:
      'A democracia ateniense era direta (os próprios cidadãos votavam as leis na Eclésia), porém excludente segundo os critérios modernos, pois restringia a cidadania aos homens adultos livres nascidos de pai e mãe atenienses (Alternativa B).',
  },

  // ===================== LINGUAGENS (6 Questões) =====================
  {
    id: 'enem-2024-lc-014',
    year: 2024,
    bookletColor: 'Amarela',
    discipline: 'linguagens',
    subject: 'Português',
    difficulty: 'Fácil',
    topic: 'Funções da Linguagem e Gêneros Textuais',
    title:
      '"Palavra puxa palavra, uma ideia traz outra, e assim se faz um livro, um governo, ou uma revolução; alguns dizem que assim é que a natureza compôs as suas espécies." (Machado de Assis, Memórias Póstumas de Brás Cubas). No fragmento machadiano, ao refletir sobre o próprio processo de construção da escrita e da engrenagem textual, predomina a função da linguagem:',
    alternatives: [
      'Fática, pois testa exclusivamente o canal físico de comunicação com o leitor.',
      'Metalinguística, pois o código verbal volta-se para explicar a própria elaboração da linguagem e do texto.',
      'Conativa ou apelativa, por impor uma ordem direta de compra ao destinatário.',
      'Referencial pura, típica de boletins meteorológicos isentos de subjetividade.',
      'Emotiva, centrada apenas em interjeições de dor física imediata.',
    ],
    correctAlternative: 'B',
    explanation:
      'Quando o narrador comenta o próprio ato de escrever ("Palavra puxa palavra... e assim se faz um livro"), ocorre o uso do código para refletir sobre o próprio código e a criação literária, caracterizando a função metalinguística (Alternativa B).',
  },
  {
    id: 'enem-2024-lc-022',
    year: 2024,
    bookletColor: 'Azul',
    discipline: 'linguagens',
    subject: 'Português',
    difficulty: 'Fácil',
    topic: 'Campanhas Publicitárias e Função Apelativa',
    title:
      'Em uma campanha nacional de doação de sangue veiculada pelo Ministério da Saúde, lê-se o slogan: "Não deixe para amanhã a vida que você pode salvar hoje. Procure o hemocentro mais próximo e doe sangue." A escolha dos verbos no modo imperativo ("Não deixe", "Procure", "doe") e o pronome de tratamento direto ("você") cumprem a estratégia argumentativa de:',
    alternatives: [
      'relatar de forma impessoal dados estatísticos sobre a produção de plasma.',
      'interpelar diretamente o leitor, buscando engajá-lo em uma mudança imediata de comportamento cívico (função conativa/apelativa).',
      'questionar a validade gramatical dos pronomes oblíquos na língua falada.',
      'expressar um desabafo íntimo do autor sem intenção de atingir o público.',
      'explicar o significado dicionarizado do substantivo "hemocentro".',
    ],
    correctAlternative: 'B',
    explanation:
      'Campanhas comunitárias e publicitárias apoiam-se na função conativa (ou apelativa), marcada por verbos no imperativo e vocativos/pronomes na 2ª pessoa para persuadir o interlocutor a adotar uma atitude socialmente relevante (Alternativa B).',
  },
  {
    id: 'enem-2023-lc-029',
    year: 2023,
    bookletColor: 'Branca',
    discipline: 'linguagens',
    subject: 'Português',
    difficulty: 'Médio',
    topic: 'Variação Linguística e Patrimônio Cultural',
    title:
      'Os falares regionais brasileiros — como o uso de "tu" com verbo na terceira pessoa em diversas capitais do Norte e do Sul, ou expressões como "oxente", "uai" e "tchê" — são frequentemente alvo de julgamentos sociais fora de seus contextos de origem. Sob a ótica da Sociolinguística contemporânea cobrada no ENEM, tais usos demonstram que:',
    alternatives: [
      'a língua portuguesa sofre deterioração gramatical irreversível fora dos centros financeiros.',
      'as variedades regionais constituem sistemas legítimos de identidade cultural e eficácia comunicativa em suas comunidades.',
      'a norma-padrão escrita deve substituir integralmente a oralidade familiar e espontânea.',
      'o preconceito linguístico fundamenta-se em critérios estritamente científicos de superioridade fonética.',
      'a comunicação oral só se realiza plenamente quando segue a sintaxe quinhentista lusitana.',
    ],
    correctAlternative: 'B',
    explanation:
      'Para a Sociolinguística, toda variedade linguística atende às necessidades expressivas e identitárias de seus falantes. A adequação ao contexto comunicativo substitui a noção preconceituosa de "erro" nas variedades regionais (Alternativa B).',
  },
  {
    id: 'enem-2023-lc-035',
    year: 2023,
    bookletColor: 'Rosa',
    discipline: 'linguagens',
    subject: 'Literatura',
    difficulty: 'Médio',
    topic: 'Modernismo Brasileiro — 1ª Geração (Oswald de Andrade)',
    title:
      '"Dê-me um cigarro / Diz a gramática / Do professor e do aluno / E do mulato sabido / Mas o bom negro e o bom branco / Da Nação Brasileira / Dizem todos os dias / Deixa disso camarada / Me dá um cigarro." (Oswald de Andrade, Pronominais). No poema modernista de 1925, a contraposição entre "Dê-me um cigarro" e "Me dá um cigarro" sintetiza o projeto estético da primeira geração modernista de:',
    alternatives: [
      'defender o purismo gramatical parnasiano contra as influências populares.',
      'valorizar a língua falada cotidiana no Brasil e romper com a subordinação acrítica às normas lusitanas artificiais.',
      'proibir o ensino da escrita formal nas escolas públicas brasileiras.',
      'retomar a métrica decassilábica camoniana do Classicismo renascentista.',
      'isolar a poesia das questões de identidade nacional e oralidade.',
    ],
    correctAlternative: 'B',
    explanation:
      'No poema "Pronominais", Oswald de Andrade aproxima a literatura da fala real brasileira (colocação proclítica espontânea "Me dá"), criticando o artificialismo acadêmico que ignorava a identidade linguística nacional (Alternativa B).',
  },
  {
    id: 'enem-2022-lc-018',
    year: 2022,
    bookletColor: 'Azul',
    discipline: 'linguagens',
    subject: 'Redação & Argumentação',
    difficulty: 'Médio',
    topic: 'Coesão Referencial e Sequencial no Texto Argumentativo',
    title:
      'Em um texto dissertativo-argumentativo, o emprego de operadores argumentativos como "Todavia", "Por conseguinte", "Outrossim" e "Sob essa ótica" desempenha papel decisivo na Competência 4 da Redação do ENEM. Os conectivos "Todavia" e "Por conseguinte" estabelecem entre os períodos ou parágrafos, respectivamente, relações lógico-semânticas de:',
    alternatives: [
      'adição e explicação.',
      'oposição (adversidade) e conclusão (consequência).',
      'finalidade e condição.',
      'proporcionalidade e comparação.',
      'conformidade e alternância.',
    ],
    correctAlternative: 'B',
    explanation:
      '"Todavia" (assim como contudo, entretanto, no entanto) introduz uma relação de oposição/contraste (adversativa). Já "Por conseguinte" (assim como portanto, logo, destarte) introduz uma relação lógica de conclusão/consequência (Alternativa B).',
  },
  {
    id: 'enem-2022-lc-041',
    year: 2022,
    bookletColor: 'Amarela',
    discipline: 'linguagens',
    subject: 'Artes & Tecnologia',
    difficulty: 'Difícil',
    topic: 'Arte Contemporânea, Hipertexto e Cultura Digital',
    title:
      'As instalações interativas na arte contemporânea — nas quais o visitante precisa caminhar, tocar sensores ou produzir sons para que a obra aconteça — alteram profundamente o estatuto tradicional da recepção estética. Nesse tipo de manifestação artística, o público deixa a condição de espectador contemplativo passivo e passa a atuar como:',
    alternatives: [
      'comprador exclusivo de telas a óleo renascentistas.',
      'coautor e participante ativo na construção de sentidos da obra.',
      'crítico conservador avesso ao uso de suportes tecnológicos.',
      'restaurador técnico de esculturas em mármore clássico.',
      'observador distanciado proibido de interagir com o espaço expositivo.',
    ],
    correctAlternative: 'B',
    explanation:
      'Na arte contemporânea participativa e nas instalações multimídia, a obra se completa na interação corporal e sensorial do público, que assume o papel de coautor/participante ativo da experiência estética (Alternativa B).',
  },
];

// Esquemas Visuais Didáticos em SVG (Data URI) para as Apostilas (funcionam 100% Online e Offline)
const SVG_APOSTILA_ESCALAS =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="680" height="220" viewBox="0 0 680 220">
  <rect width="680" height="220" rx="14" fill="#FAF9F6" stroke="#E6E4DD"/>
  <text x="24" y="32" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1F201D">Esquema Visual: Como a Escala Linear (1:k) afeta Comprimento, Área e Volume</text>
  <rect x="24" y="52" width="195" height="142" rx="10" fill="#EBF2FC" stroke="#B8D2F4"/>
  <text x="42" y="78" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1D5FBF">1D · Comprimento (Linear)</text>
  <line x1="45" y1="115" x2="185" y2="115" stroke="#1D5FBF" stroke-width="4"/>
  <text x="45" y="145" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1F201D">Razão = E = d / R</text>
  <text x="45" y="168" font-family="sans-serif" font-size="11.5" fill="#636361">Ex: Escala 1 : 100 (×10²)</text>

  <rect x="242" y="52" width="195" height="142" rx="10" fill="#E6F2F0" stroke="#B6DBD6"/>
  <text x="262" y="78" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1B6E66">2D · Área (Superfície)</text>
  <rect x="295" y="92" width="80" height="34" rx="4" fill="#1B6E66" fill-opacity="0.2" stroke="#1B6E66" stroke-width="2"/>
  <text x="262" y="148" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1F201D">Razão = E² = (d / R)²</text>
  <text x="262" y="168" font-family="sans-serif" font-size="11.5" fill="#636361">Ex: 1 : 10 000 (×10⁴)</text>

  <rect x="460" y="52" width="196" height="142" rx="10" fill="#FDF3E6" stroke="#F3D89B"/>
  <text x="478" y="78" font-family="sans-serif" font-size="13" font-weight="bold" fill="#92400E">3D · Volume (Capacidade)</text>
  <rect x="515" y="90" width="64" height="36" rx="4" fill="#92400E" fill-opacity="0.2" stroke="#92400E" stroke-width="2"/>
  <text x="478" y="148" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1F201D">Razão = E³ = (d / R)³</text>
  <text x="478" y="168" font-family="sans-serif" font-size="11.5" fill="#636361">Ex: 1 : 1 000 000 (×10⁶)</text>
</svg>`);

const SVG_APOSTILA_CIRCUITOS =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="680" height="220" viewBox="0 0 680 220">
  <rect width="680" height="220" rx="14" fill="#FAF9F6" stroke="#E6E4DD"/>
  <text x="24" y="32" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1F201D">Comparativo Visual: Associação de Resistores em Série vs. Paralelo</text>
  <rect x="24" y="50" width="305" height="146" rx="10" fill="#F2F0EA" stroke="#E6E4DD"/>
  <text x="42" y="76" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1F201D">Em Série (Mesma Corrente i)</text>
  <line x1="44" y1="110" x2="295" y2="110" stroke="#1B6E66" stroke-width="3"/>
  <rect x="85" y="98" width="55" height="24" rx="4" fill="#FFFFFF" stroke="#1B6E66" stroke-width="2"/>
  <rect x="185" y="98" width="55" height="24" rx="4" fill="#FFFFFF" stroke="#1B6E66" stroke-width="2"/>
  <text x="102" y="114" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1B6E66">R1</text>
  <text x="202" y="114" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1B6E66">R2</text>
  <text x="42" y="152" font-family="sans-serif" font-size="12" fill="#1F201D">• Req = R1 + R2 (Tensão U se divide)</text>
  <text x="42" y="174" font-family="sans-serif" font-size="12" fill="#B42318">• Se 1 lâmpada queima, todas apagam!</text>

  <rect x="350" y="50" width="306" height="146" rx="10" fill="#E6F2F0" stroke="#B6DBD6"/>
  <text x="368" y="76" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1B6E66">Em Paralelo (Mesma Tensão U — Casa)</text>
  <line x1="380" y1="96" x2="610" y2="96" stroke="#1B6E66" stroke-width="2.5"/>
  <line x1="380" y1="126" x2="610" y2="126" stroke="#1B6E66" stroke-width="2.5"/>
  <rect x="465" y="86" width="60" height="20" rx="4" fill="#FFFFFF" stroke="#1B6E66" stroke-width="2"/>
  <rect x="465" y="116" width="60" height="20" rx="4" fill="#FFFFFF" stroke="#1B6E66" stroke-width="2"/>
  <text x="368" y="158" font-family="sans-serif" font-size="12" fill="#1F201D">• Todos recebem a mesma d.d.p. (127V/220V)</text>
  <text x="368" y="178" font-family="sans-serif" font-size="12" fill="#1E5631">• Funcionamento independente na tomada!</text>
</svg>`);

const SVG_APOSTILA_REDACAO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="680" height="210" viewBox="0 0 680 210">
  <rect width="680" height="210" rx="14" fill="#FAF9F6" stroke="#E6E4DD"/>
  <text x="24" y="32" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1F201D">Arquitetura Visual da Redação Nota 1000 (4 Parágrafos Estratégicos)</text>
  <rect x="24" y="52" width="148" height="134" rx="10" fill="#F3EBF9" stroke="#D9C2EC"/>
  <text x="36" y="76" font-family="sans-serif" font-size="12" font-weight="bold" fill="#6B3FA0">1. Introdução (6-7 l.)</text>
  <text x="36" y="100" font-family="sans-serif" font-size="11" fill="#1F201D">• Repertório inicial</text>
  <text x="36" y="120" font-family="sans-serif" font-size="11" fill="#1F201D">• Recorte do Tema</text>
  <text x="36" y="140" font-family="sans-serif" font-size="11" fill="#1F201D">• Tese (A1 + A2)</text>

  <rect x="186" y="52" width="148" height="134" rx="10" fill="#EBF2FC" stroke="#B8D2F4"/>
  <text x="198" y="76" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1D5FBF">2. Desenv. 1 (7-8 l.)</text>
  <text x="198" y="100" font-family="sans-serif" font-size="11" fill="#1F201D">• Tópico frasal A1</text>
  <text x="198" y="120" font-family="sans-serif" font-size="11" fill="#1F201D">• Repertório (C2)</text>
  <text x="198" y="140" font-family="sans-serif" font-size="11" fill="#1F201D">• Juízo crítico (C3)</text>

  <rect x="348" y="52" width="148" height="134" rx="10" fill="#EBF2FC" stroke="#B8D2F4"/>
  <text x="360" y="76" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1D5FBF">3. Desenv. 2 (7-8 l.)</text>
  <text x="360" y="100" font-family="sans-serif" font-size="11" fill="#1F201D">• Conectivo "Ademais"</text>
  <text x="360" y="120" font-family="sans-serif" font-size="11" fill="#1F201D">• Argumento A2</text>
  <text x="360" y="140" font-family="sans-serif" font-size="11" fill="#1F201D">• Causa/Consequência</text>

  <rect x="510" y="52" width="146" height="134" rx="10" fill="#E9F5EC" stroke="#B5DFB9"/>
  <text x="522" y="76" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2E7D32">4. Conclusão (C5)</text>
  <text x="522" y="98" font-family="sans-serif" font-size="10.5" fill="#1F201D">1. Agente + 2. Ação</text>
  <text x="522" y="116" font-family="sans-serif" font-size="10.5" fill="#1F201D">3. Meio/Modo</text>
  <text x="522" y="134" font-family="sans-serif" font-size="10.5" fill="#1F201D">4. Efeito + 5. Detalhe</text>
</svg>`);

// Apostilas e Conteúdos Teóricos Completos por Grande Área do ENEM (16 Módulos Detalhados)
export const THEORY_MODULES = {
  matematica: [
    {
      id: 'teo-mt-1',
      discipline: 'matematica',
      subject: 'Matemática Básica',
      title: 'Razão, Proporção, Escalas e Porcentagem',
      readingTime: '12 min de leitura',
      incidence: 'Altíssima incidência (28% da prova)',
      summary:
        'Domine escalas cartográficas (lineares, superficiais e volumétricas), grandezas diretamente e inversamente proporcionais e aumentos/descontos sucessivos.',
      imageUrl: SVG_APOSTILA_ESCALAS,
      imageCaption:
        'Infográfico: Na escala volumétrica (3D), o fator de redução ou ampliação deve ser elevado ao cubo (E³).',
      enemTrap: {
        title: 'Pegadinha Clássica: Escala de Volume e Descontos Sucessivos',
        wrongThinking:
          'Multiplicar o volume da maquete apenas pela escala linear E (ex: multiplicar por 50 em vez de 50³) ou somar dois descontos sucessivos de 20% + 20% achando que dá 40%.',
        correctThinking:
          'Se a questão fala em litros, m³ ou capacidade da maquete, eleve a escala ao CUBO (E³). Em porcentagens sucessivas, multiplique os fatores: dois descontos de 20% equivalem a 0,8 × 0,8 = 0,64 (36% de desconto real).',
        quickQuestion:
          'Uma loja oferece 20% de desconto em um produto e, no pagamento à vista, dá mais 10% sobre o novo valor. Qual o desconto total?',
        options: [
          '30% (Pegadinha da soma direta)',
          '28% (0,80 × 0,90 = 0,72 → desconto real de 28%)',
        ],
        correctOptionIndex: 1,
      },
      keyFormulas: [
        'Escala Linear: E = d / R',
        'Escala de Área: E² = Área desenho / Área real',
        'Escala de Volume: E³ = Volume maquete / Volume real',
        'Conversão chave: 1 m³ = 1 000 L | 1 dm³ = 1 L | 1 cm³ = 1 mL',
      ],
      sections: [
        {
          heading: '1. Escala Linear, de Área e de Volume',
          body: 'Se a escala linear entre o desenho (d) e o tamanho real (R) é E = d / R, então a razão entre as áreas é E² e a razão entre os volumes é E³. No ENEM, sempre converta as unidades antes de elevar ao quadrado ou ao cubo: 1 metro equivale a 100 cm e 1 km equivale a 100 000 cm.',
        },
        {
          heading: '2. Fator de Multiplicação em Porcentagem',
          body: 'Para um acréscimo de i%, multiplique por (1 + i/100). Para um desconto de i%, multiplique por (1 - i/100). Dois descontos sucessivos de 10% equivalem a 0,9 × 0,9 = 0,81 (desconto acumulado de 19%, e nunca 20%).',
        },
        {
          heading: '3. Divisão Diretamente e Inversamente Proporcional',
          body: 'Se uma grandeza Y é diretamente proporcional a A e inversamente proporcional a B, escrevemos Y = k · (A / B), onde k é a constante de proporcionalidade. Essa modelagem resolve 90% das questões de divisão de lucros, vazão de torneiras e engrenagens.',
        },
      ],
    },
    {
      id: 'teo-mt-2',
      discipline: 'matematica',
      subject: 'Estatística & Probabilidade',
      title: 'Estatística (Média, Moda, Mediana) e Probabilidade',
      readingTime: '11 min de leitura',
      incidence: 'Presença garantida (4 a 6 questões por ano)',
      summary:
        'Diferencie média simples, média ponderada, cálculo rápido da mediana em gráficos e probabilidade condicional sem reposição.',
      imageUrl: SVG_CHART_RESERVATORIO,
      imageCaption:
        'Gráfico de série temporal: no ENEM, antes de extrair a mediana dos pontos do gráfico, coloque todos os valores do eixo Y em ordem crescente.',
      enemTrap: {
        title: 'Pegadinha Clássica: Pegar o Termo do Meio Sem Ordenar a Tabela',
        wrongThinking:
          'Olhar uma tabela de 7 dias (Segunda a Domingo), pegar diretamente o valor de Quinta-feira (4º dia) e marcar como Mediana sem ordenar os números.',
        correctThinking:
          'A mediana exige que os dados estejam em ROL (ordem crescente ou decrescente). Sempre reescreva os números em ordem crescente antes de pegar o termo central!',
        quickQuestion:
          'Qual é a mediana da sequência de notas: 8, 10, 4, 9, 5?',
        options: [
          'Nota 4 (Pegadinha: número que está no meio da frase sem ordenar)',
          'Nota 8 (Ordenando: 4, 5, 8, 9, 10 → o termo central é 8)',
        ],
        correctOptionIndex: 1,
      },
      keyFormulas: [
        'Média Ponderada: Mp = (x₁·p₁ + x₂·p₂ + ...) / (p₁ + p₂ + ...)',
        'Mediana (n ímpar): termo central na posição (n + 1)/2 após ordenar',
        'Probabilidade da União: P(A ∪ B) = P(A) + P(B) - P(A ∩ B)',
        'Eventos Independentes: P(A ∩ B) = P(A) × P(B)',
      ],
      sections: [
        {
          heading: '1. Mediana sem armadilhas',
          body: 'O erro mais comum no ENEM é pegar o termo central da tabela na ordem em que aparece no enunciado. Sempre ordene os dados em rol (crescente ou decrescente) antes de localizar o elemento central (se n for ímpar) ou a média aritmética dos dois elementos centrais (se n for par).',
        },
        {
          heading: '2. Desvio-Padrão e Regularidade',
          body: 'O ENEM frequentemente pede para escolher o atleta, máquina ou investimento "mais regular" ou "mais homogêneo". Você raramente precisa calcular a raiz quadrada do desvio-padrão: basta observar qual conjunto possui os valores mais próximos da própria média!',
        },
        {
          heading: '3. Probabilidade Complementar ("Pelo menos um")',
          body: 'Quando a questão pedir a probabilidade de ocorrer "pelo menos um acerto", calcule 100% menos a probabilidade de NÃO ocorrer nenhum acerto: P(pelo menos 1) = 1 - P(nenhum).',
        },
      ],
    },
    {
      id: 'teo-mt-3',
      discipline: 'matematica',
      subject: 'Álgebra & Funções',
      title: 'Funções de 1º e 2º Grau e Progressões (PA e PG)',
      readingTime: '14 min de leitura',
      incidence: 'Alta incidência (4 a 5 questões)',
      summary:
        'Modelagem de custos fixos e variáveis com função afim, lucro máximo no vértice da parábola e crescimento linear vs. exponencial.',
      imageUrl: SVG_CHART_PARABOLA,
      imageCaption:
        'Parábola com concavidade para baixo (a < 0): o ponto de máximo tem abscissa Xv (metade do alcance) e ordenada Yv (altura máxima).',
      enemTrap: {
        title: 'Pegadinha Clássica: Trocar o X do Vértice (Xv) pelo Y do Vértice (Yv)',
        wrongThinking:
          'A questão pergunta "Qual é o LUCRO MÁXIMO obtido pela empresa?", o candidato calcula Xv = -b/(2a), encontra esse número na Alternativa A e marca errado!',
        correctThinking:
          'Sublinhe o comando da questão: se pedir "qual o preço/tempo/quantidade QUE GERA o máximo", é Xv. Se pedir "qual é o VALOR MÁXIMO (lucro máximo, altura máxima)", é Yv = -Δ/(4a)!',
        quickQuestion:
          'Na função lucro L(x) = -x² + 10x, onde x é o número de peças vendidas, qual é o LUCRO MÁXIMO?',
        options: [
          '5 reais (Pegadinha: 5 é o Xv, ou seja, a quantidade de peças)',
          '25 reais (Yv = L(5) = -25 + 50 = 25 reais de lucro máximo)',
        ],
        correctOptionIndex: 1,
      },
      keyFormulas: [
        'Função Afim: f(x) = a·x + b (a = taxa de variação, b = valor inicial)',
        'Vértice da Parábola: Xv = -b / (2a) ou média das raízes (x₁ + x₂)/2',
        'Valor Máximo/Mínimo: Yv = -Δ / (4a)',
        'Termo Geral da PA: aₙ = a₁ + (n - 1)·r | Soma: Sₙ = (a₁ + aₙ)·n / 2',
      ],
      sections: [
        {
          heading: '1. Quando usar Xv ou Yv na Função Quadrática?',
          body: 'Se a pergunta pedir a quantidade/preço/tempo que gera o máximo, calcule Xv = -b/(2a). Se a pergunta pedir qual é o lucro máximo ou a altura máxima atingida, calcule Yv = f(Xv). Dica rápida: Xv está sempre exatamente no meio do caminho entre as duas raízes!',
        },
        {
          heading: '2. PA vs. PG nos enunciados',
          body: 'Acréscimos constantes a cada período (ex: +150 unidades por mês) formam uma Progressão Aritmética (crescimento linear). Multiplicações ou taxas percentuais constantes a cada período (ex: dobra a cada hora ou cresce 10% ao ano) formam uma Progressão Geométrica (crescimento exponencial).',
        },
      ],
    },
    {
      id: 'teo-mt-4',
      discipline: 'matematica',
      subject: 'Geometria',
      title: 'Geometria Plana, Espacial e Projeções Ortogonais',
      readingTime: '15 min de leitura',
      incidence: 'Altíssima incidência (22% da prova)',
      summary:
        'Volumes de prismas, cilindros, cones e esferas, teorema de Pitágoras e visão espacial de projeções no plano.',
      imageUrl: SVG_APOSTILA_ESCALAS,
      imageCaption:
        'Relações métricas e volumétricas: lembre-se sempre de dividir o diâmetro por 2 para obter o raio antes de aplicar V = π·r²·h.',
      enemTrap: {
        title: 'Pegadinha Clássica: Usar o Diâmetro no Lugar do Raio',
        wrongThinking:
          'O enunciado diz "um reservatório cilíndrico de 6 metros de DIÂMETRO", e o candidato joga r = 6 diretamente na fórmula V = π·r²·h, multiplicando o volume correto por 4!',
        correctThinking:
          'Toda vez que ler a palavra DIÂMETRO no ENEM, pare imediatamente e escreva R = D / 2 no caderno de prova antes de fazer qualquer conta!',
        quickQuestion:
          'Um cilindro tem diâmetro da base igual a 4 m e altura de 5 m. Qual a expressão correta do seu volume?',
        options: [
          'V = π · 4² · 5 = 80π m³ (Pegadinha do diâmetro)',
          'V = π · 2² · 5 = 20π m³ (Usando o raio r = 2 m corretamente)',
        ],
        correctOptionIndex: 1,
      },
      keyFormulas: [
        'Prisma e Cilindro: V = Área da Base × h (Cilindro: V = π·r²·h)',
        'Pirâmide e Cone (têm ponta!): V = (Área da Base × h) / 3',
        'Esfera: V = (4/3)·π·r³ | Área superficial = 4·π·r²',
        'Triângulo Equilátero de lado L: Altura = L√3 / 2 | Área = L²√3 / 4',
      ],
      sections: [
        {
          heading: '1. Regra de Ouro dos Volumes',
          body: 'Sólidos que sobem retos da base até o topo (prismas e cilindros) têm volume V = Ab · h. Sólidos que afunilam em um vértice/ponta (pirâmides e cones) têm volume dividido por 3: V = (Ab · h) / 3.',
        },
        {
          heading: '2. Projeção Ortogonal',
          body: 'Imagine uma lanterna iluminando o objeto de cima para baixo perpendicularmente ao chão. A sombra projetada é a projeção ortogonal. Deslocamentos apenas verticais viram um único ponto; curvas no espaço que não voltam sobre si mesmas projetam segmentos ou arcos contínuos.',
        },
      ],
    },
  ],

  natureza: [
    {
      id: 'teo-cn-1',
      discipline: 'natureza',
      subject: 'Física',
      title: 'Eletrodinâmica, Circuitos e Consumo de Energia',
      readingTime: '14 min de leitura',
      incidence: 'Top 1 em Física no ENEM',
      summary:
        'Leis de Ohm, associação de resistores em série e paralelo, disjuntores, efeito Joule e cálculo da conta de luz em kWh.',
      imageUrl: SVG_APOSTILA_CIRCUITOS,
      imageCaption:
        'Esquema de circuito em série vs. paralelo: instalações domésticas são em paralelo para manter a mesma tensão (ddp) em todos os aparelhos.',
      enemTrap: {
        title: 'Pegadinha Clássica: Achar que Maior Resistência Esquenta Mais o Chuveiro',
        wrongThinking:
          'Pensar que "para esquentar mais a água no modo Inverno, devemos aumentar a resistência elétrica do chuveiro".',
        correctThinking:
          'Na tomada residencial, a tensão U é constante (127V ou 220V), logo usamos P = U² / R. Para ter MAIOR potência (água mais quente), precisamos DIMINUIR o comprimento do resistor R!',
        quickQuestion:
          'Para deixar a água do chuveiro mais quente (Posição Inverno) sob tensão constante U = 220V, o que acontece com a resistência R?',
        options: [
          'Aumenta a resistência R (Pegadinha clássica)',
          'Diminui a resistência R, aumentando a corrente e a potência P = U²/R',
        ],
        correctOptionIndex: 1,
      },
      keyFormulas: [
        '1ª Lei de Ohm: U = R · i',
        'Potência Elétrica: P = U · i = R · i² = U² / R',
        'Energia Consumida: E = P · Δt (em kWh: Potência em kW × tempo em horas)',
        'Resistores em Paralelo (2 iguais): Req = R / 2 (mesma tensão U em todos!)',
      ],
      sections: [
        {
          heading: '1. Instalações Residenciais são sempre em Paralelo',
          body: 'Na sua casa, lâmpadas, geladeira e chuveiro são ligados em paralelo para que todos recebam a mesma tensão da rede (127 V ou 220 V) e funcionem de forma independente. No chuveiro, diminuir a resistência R (chave no "Inverno") aumenta a potência dissipada P = U²/R, esquentando mais a água.',
        },
        {
          heading: '2. Como calcular o consumo mensal (kWh)',
          body: 'Transforme a potência de watts (W) para quilowatts (kW) dividindo por 1 000. Transforme o tempo diário em horas (ex: 30 min = 0,5 h) e multiplique pelo número de dias do mês.',
        },
      ],
    },
    {
      id: 'teo-cn-2',
      discipline: 'natureza',
      subject: 'Física',
      title: 'Termologia, Calorimetria e Fenômenos Ondulatórios',
      readingTime: '13 min de leitura',
      incidence: 'Top 2 em Física no ENEM',
      summary:
        'Calor sensível vs. latente, equilíbrio térmico, refração, difração, ressonância e efeito Doppler.',
      imageUrl: SVG_CHART_TERMODINAMICA,
      imageCaption:
        'Curva de aquecimento: nos patamares planos (fusão e ebulição), a substância pura recebe calor latente sem variar sua temperatura.',
      enemTrap: {
        title: 'Pegadinha Clássica: Dizer que a Frequência da Onda Muda na Refração',
        wrongThinking:
          'Afirmar que quando a luz passa do ar para a água (refração), sua frequência diminui junto com a velocidade.',
        correctThinking:
          'A frequência de uma onda depende EXCLUSIVAMENTE da fonte que a emitiu! Ao mudar de meio (refração), mudam a velocidade (v) e o comprimento de onda (λ), mas a frequência (f) permanece 100% constante.',
        quickQuestion:
          'Um feixe de luz monocromática passa do ar para o vidro (refração). O que ocorre com sua velocidade e sua frequência?',
        options: [
          'Ambas diminuem no vidro (Pegadinha)',
          'A velocidade diminui, mas a frequência permanece constante',
        ],
        correctOptionIndex: 1,
      },
      keyFormulas: [
        'Calor Sensível (muda T): Q = m · c · ΔT',
        'Calor Latente (muda estado físico): Q = m · L',
        'Equação Fundamental da Onda: v = λ · f',
        'Período e Frequência: T = 1 / f',
      ],
      sections: [
        {
          heading: '1. Na Refração, a Frequência NUNCA muda',
          body: 'Quando uma onda luminosa ou sonora passa de um meio para outro (refração), sua velocidade v e seu comprimento de onda λ mudam na mesma proporção, mas a frequência f permanece idêntica porque depende exclusivamente da fonte emissora.',
        },
        {
          heading: '2. Difração, Interferência e Polarização',
          body: 'Difração é a capacidade da onda de contornar obstáculos (explica por que ouvimos alguém atrás de um muro). Polarização é exclusiva de ondas transversais (como a luz); ondas longitudinais (como o som no ar) não podem ser polarizadas.',
        },
      ],
    },
    {
      id: 'teo-cn-3',
      discipline: 'natureza',
      subject: 'Química',
      title: 'Química Orgânica, Polaridade, Interações e Estequiometria',
      readingTime: '15 min de leitura',
      incidence: 'Top 1 em Química no ENEM',
      summary:
        'Funções orgânicas, forças intermoleculares (ligação de hidrogênio vs. dipolo induzido), tensoativos e cálculo estequiométrico.',
      imageUrl: SVG_CHART_TERMODINAMICA,
      imageCaption:
        'Pontos de ebulição e forças intermoleculares: ligações de hidrogênio (-OH, -NH) exigem muito mais energia térmica para romper do que interações de dipolo induzido.',
      enemTrap: {
        title: 'Pegadinha Clássica: Confundir Fenol com Álcool e Amida com Amina',
        wrongThinking:
          'Ver uma hidroxila (-OH) ligada diretamente a um anel aromático (benzeno) e classificar a função orgânica como Álcool.',
        correctThinking:
          'Hidroxila (-OH) ligada a carbono saturado (sp³) é ÁLCOOL. Hidroxila (-OH) ligada diretamente ao anel benzênico é FENOL (caráter ácido)! E se tiver carbonila (C=O) ligada ao nitrogênio, é AMIDA (não amina).',
        quickQuestion:
          'Uma molécula possui o grupo -OH ligado diretamente a um anel benzênico (aromático). Qual é essa função orgânica?',
        options: [
          'Álcool aromático (Pegadinha recorrente no ENEM)',
          'Fenol (Hidroxila ligada diretamente a carbono do anel aromático)',
        ],
        correctOptionIndex: 1,
      },
      keyFormulas: [
        'Hidrocarbonetos (só C e H): sempre APOLARES (lipossolúveis)',
        'Grupos OH e NH (Álcool, Ácido Carboxílico, Amina): fazem Ligação de Hidrogênio (hidrossolúveis)',
        'Mols: n = massa (g) / Massa Molar (g/mol)',
        'Volume Molar (CNTP): 1 mol de gás = 22,4 L',
      ],
      sections: [
        {
          heading: '1. "Semelhante dissolve semelhante" e Vitaminas',
          body: 'Moléculas com muitas hidroxilas (-OH), como a Vitamina C, formam ligações de hidrogênio com a água (hidrossolúveis) e são eliminadas facilmente na urina. Moléculas com longas cadeias carbônicas e quase nenhum grupo polar, como as Vitaminas A, D, E e K, são apolares (lipossolúveis) e acumulam-se no tecido adiposo.',
        },
        {
          heading: '2. Receita de 4 Passos para Estequiometria',
          body: '1º) Balanceie a equação química; 2º) Escreva a proporção em mols das substâncias envolvidas; 3º) Converta para a grandeza pedida (massa, volume ou nº de moléculas); 4º) Aplique a regra de três aplicando pureza no início e rendimento no final.',
        },
      ],
    },
    {
      id: 'teo-cn-4',
      discipline: 'natureza',
      subject: 'Biologia',
      title: 'Ecologia, Ciclos Biogeoquímicos, Genética e Imunologia',
      readingTime: '12 min de leitura',
      incidence: 'Top 1 em Biologia no ENEM',
      summary:
        'Ciclo do nitrogênio, eutrofização, magnificação trófica, biotecnologia (DNA recombinante/PCR) e diferença entre soro e vacina.',
      imageUrl: SVG_APOSTILA_CIRCUITOS,
      imageCaption:
        'Fluxo biológico: diferencie sempre o acúmulo de nutrientes orgânicos (Eutrofização) da bioacumulação de metais pesados ao longo da cadeia (Magnificação Trófica).',
      enemTrap: {
        title: 'Pegadinha Clássica: Confundir Soro Antiveneno com Vacina',
        wrongThinking:
          'Marcar que uma pessoa picada por uma cobra jararaca deve receber uma "vacina antiofídica para estimular a produção rápida de memória imunológica".',
        correctThinking:
          'Vacina contém ANTÍGENOS atenuados/inativados (prevenção, leva dias para gerar memória). Em emergências (picada de cobra/escorpião), aplica-se SORO, que já contém ANTICORPOS prontos (imunização passiva imediata)!',
        quickQuestion:
          'Um trabalhador rural foi picado por uma serpente peçonhenta. Qual o tratamento imediato correto?',
        options: [
          'Vacina com antígenos para criar memória imunológica (Pegadinha)',
          'Soro contendo anticorpos específicos prontos (Imunização passiva)',
        ],
        correctOptionIndex: 1,
      },
      keyFormulas: [
        'Fixação do Nitrogênio: N₂ → NH₃ (bactérias Rhizobium nas leguminosas)',
        'Nitrificação: Nitrosação (NH₃ → NO₂⁻) + Nitratação (NO₂⁻ → NO₃⁻)',
        'Vacina = Antígenos (Imunização Ativa, gera memória imunológica)',
        'Soro = Anticorpos prontos (Imunização Passiva, ação imediata curativa)',
      ],
      sections: [
        {
          heading: '1. Eutrofização vs. Magnificação Trófica',
          body: 'A eutrofização ocorre pelo despejo de esgoto doméstico ou fertilizantes ricos em nitratos e fosfatos: algas proliferam na superfície, bloqueiam a luz, morrem e bactérias aeróbicas consomem o oxigênio dissolvido, matando os peixes por asfixia. Já a magnificação trófica ocorre com metais pesados (mercúrio) e pesticidas (DDT), que se acumulam em maior concentração no topo da cadeia alimentar.',
        },
      ],
    },
  ],

  humanas: [
    {
      id: 'teo-ch-1',
      discipline: 'humanas',
      subject: 'Geografia',
      title: 'Demografia, Urbanização, Biomas e Geografia Agrária',
      readingTime: '11 min de leitura',
      incidence: 'Altíssima incidência em Geografia',
      summary:
        'Transição demográfica brasileira, envelhecimento populacional, domínios morfoclimáticos e fronteira agrícola.',
      imageUrl: SVG_CHART_DEMOGRAFIA,
      imageCaption:
        'Gráfico da Transição Demográfica Brasileira: a distância entre a curva de natalidade e a de mortalidade representa o crescimento vegetativo.',
      enemTrap: {
        title: 'Pegadinha Clássica: Achar que a População Brasileira Já Está Diminuindo',
        wrongThinking:
          'Olhar a queda acentuada da linha de natalidade no gráfico e marcar que "a população absoluta do Brasil encolheu desde os anos 1980".',
        correctThinking:
          'Enquanto a Taxa de Natalidade estiver ACIMA da Taxa de Mortalidade, a população total continua crescendo (apenas em ritmo mais lento, desacelerado)!',
        quickQuestion:
          'Se a taxa de natalidade caiu de 35‰ para 13‰ e a mortalidade está em 6‰, o que ocorre com a população total?',
        options: [
          'A população total diminuiu (Pegadinha visual do gráfico)',
          'Continua crescendo em ritmo mais lento (crescimento vegetativo positivo de +7‰)',
        ],
        correctOptionIndex: 1,
      },
      keyFormulas: [
        'Crescimento Vegetativo = Taxa de Natalidade - Taxa de Mortalidade',
        'Transição Demográfica: queda da fecundidade → estreitamento da base da pirâmide',
        'Cerrado: solos ácidos (corrige com calagem), raízes profundas e troncos tortuosos',
        'Conurbação: união física da mancha urbana de dois ou mais municípios',
      ],
      sections: [
        {
          heading: '1. O Envelhecimento da População Brasileira',
          body: 'Com a urbanização a partir da década de 1960, o Brasil reduziu sua taxa de fecundidade para abaixo da taxa de reposição (menos de 2 filhos por mulher). O resultado é o estreitamento da base da pirâmide etária e o alargamento do topo, exigindo investimentos em geriatria, acessibilidade e reforma previdenciária.',
        },
        {
          heading: '2. Biomas e Domínios Morfoclimáticos',
          body: 'O ENEM cobra intensamente a relação entre clima, solo e vegetação: a Amazônia possui solo lixiviado/arenoso mantido fértil pela serapilheira (reciclagem orgânica da própria floresta); o Cerrado sofre com a expansão da soja (MATOPIBA) e a compactação/laterização do solo; a Caatinga apresenta plantas xerófilas e solos rasos pedregosos.',
        },
      ],
    },
    {
      id: 'teo-ch-2',
      discipline: 'humanas',
      subject: 'História',
      title: 'História do Brasil: Colônia, Império e Era Vargas',
      readingTime: '13 min de leitura',
      incidence: 'Top 1 em História no ENEM',
      summary:
        'Herança colonial, escravidão e resistência quilombola, Segundo Reinado, trabalhismo na Era Vargas e redemocratização.',
      imageUrl: SVG_CHART_DEMOGRAFIA,
      imageCaption:
        'Linha histórica: a industrialização e urbanização iniciadas na Era Vargas (1930-1945) transformaram o perfil demográfico e trabalhista do Brasil.',
      enemTrap: {
        title: 'Pegadinha Clássica: Leis Trabalhistas de Vargas como "Concessão Sem Controle"',
        wrongThinking:
          'Marcar alternativas que tratam a CLT no Estado Novo como fruto de "plena liberdade sindical autônoma e ausência de controle estatal".',
        correctThinking:
          'No ENEM, o trabalhismo varguista tem dupla face: garantiu direitos reais históricos (CLT, salário mínimo), mas atrelou os sindicatos ao Estado (imposto sindical, proibição de greves e controle pelo Ministério do Trabalho).',
        quickQuestion:
          'Como a historiografia do ENEM caracteriza a política trabalhista do Estado Novo (1937-1945)?',
        options: [
          'Autonomia sindical irrestrita com direito livre à greve (Pegadinha)',
          'Concessão de direitos trabalhistas (CLT) articulada à tutela e controle estatal dos sindicatos',
        ],
        correctOptionIndex: 1,
      },
      keyFormulas: [
        'Era Vargas (1930–1945): Governo Provisório, Constitucional e Estado Novo (1937)',
        'Trabalhismo: CLT (1943) + controle sindical pelo Ministério do Trabalho (peleguismo)',
        'DIP (Depto. de Imprensa e Propaganda): censura + Hora do Brasil + culto cívico',
        'Constituição de 1988 ("Constituição Cidadã"): direitos sociais, SUS e voto aos 16 anos',
      ],
      sections: [
        {
          heading: '1. Cultura Afro-Brasileira e Resistência',
          body: 'Mais do que abordar o sistema escravista econômico, o ENEM valoriza as formas de resistência ativa e cultural: formação de quilombos, irmandades religiosas negras, preservação de matrizes religiosas, culinária, capoeira e imprensa negra no pós-abolição.',
        },
        {
          heading: '2. Cidadania Regulada na Era Vargas',
          body: 'O conceito de "cidadania regulada" (Wanderley Guilherme dos Santos) explica como, sob Vargas, os direitos sociais e trabalhistas passaram a depender do reconhecimento profissional pelo Estado (carteira de trabalho assinada e sindicato oficial urbano), deixando trabalhadores rurais e informais à margem naquele período.',
        },
      ],
    },
    {
      id: 'teo-ch-3',
      discipline: 'humanas',
      subject: 'Filosofia',
      title: 'Filosofia Política (Contratualistas), Ética e Teoria do Conhecimento',
      readingTime: '12 min de leitura',
      incidence: 'Presença garantida (4 a 6 questões)',
      summary:
        'Comparativo direto entre Hobbes, Locke e Rousseau; ética em Aristóteles e Kant; racionalismo (Descartes) vs. empirismo (Hume).',
      imageUrl: SVG_APOSTILA_REDACAO,
      imageCaption:
        'Síntese Filosófica: os pensadores contratualistas e iluministas também são os repertórios mais fortes para fundamentar sua Redação.',
      enemTrap: {
        title: 'Pegadinha Clássica: Confundir Democracia Ateniense com Sufrágio Universal',
        wrongThinking:
          'Ler "Atenas foi o berço da democracia direta" e marcar a alternativa que diz que "todos os habitantes da pólis participavam com igualdade de voto".',
        correctThinking:
          'A democracia ateniense era DIRETA (sem deputados representantes), porém RESTRITA: apenas homens livres, maiores de idade e filhos de pai e mãe atenienses eram cidadãos (mulheres, estrangeiros/metecos e escravizados estavam excluídos).',
        quickQuestion:
          'Qual a diferença central entre a Democracia Ateniense antiga e a Democracia Contemporânea?',
        options: [
          'Atenas possuía sufrágio universal para mulheres e estrangeiros (Pegadinha)',
          'Atenas exercia democracia direta na Ágora, mas restrita a uma parcela minoritária de homens cidadãos',
        ],
        correctOptionIndex: 1,
      },
      keyFormulas: [
        'Hobbes: "O homem é o lobo do homem" → Contrato cria Estado Absolutista pela paz',
        'Locke: Direitos naturais (vida, liberdade, propriedade) → Estado Liberal limitado',
        'Rousseau: "O bom selvagem" corrompido pela propriedade → Soberania Popular (Vontade Geral)',
        'Kant (Imperativo Categórico): agir por dever racional universal, tratando o ser humano como fim',
      ],
      sections: [
        {
          heading: '1. Aristóteles (Justo Meio) vs. Kant (Dever)',
          body: 'Para Aristóteles (Ética a Nicômaco), a virtude é um hábito prático que reside na justa medida (mediania) entre dois vícios (ex: a coragem é o meio-termo entre a covardia e a temeridade), visando à eudaimonia (felicidade coletiva na pólis). Já para Kant, a moralidade de uma ação não depende de suas consequências, mas da intenção pura de cumprir o dever racional.',
        },
      ],
    },
    {
      id: 'teo-ch-4',
      discipline: 'humanas',
      subject: 'Sociologia',
      title: 'Cidadania, Movimentos Sociais e Indústria Cultural',
      readingTime: '10 min de leitura',
      incidence: 'Alta incidência em Sociologia e Redação',
      summary:
        'Clássicos da Sociologia (Durkheim, Weber, Marx), Escola de Frankfurt (Adorno e Horkheimer) e movimentos sociais contemporâneos.',
      imageUrl: SVG_APOSTILA_REDACAO,
      imageCaption:
        'Sociologia aplicada: conceitos como Indústria Cultural e Patrimonialismo caem tanto nas 45 questões de Humanas quanto na Redação.',
      enemTrap: {
        title: 'Pegadinha Clássica: Confundir "Indústria Cultural" com "Cultura Popular"',
        wrongThinking:
          'Achar que Indústria Cultural (Adorno e Horkheimer) significa "valorização espontânea do folclore e das tradições comunitárias populares".',
        correctThinking:
          'Para a Escola de Frankfurt, a Indústria Cultural é a fabricação padronizada da arte (filmes, músicas comerciais) como MERCADORIA de consumo em massa, gerando passividade crítica.',
        quickQuestion:
          'Segundo Adorno e Horkheimer, qual o efeito principal da Indústria Cultural na sociedade capitalista?',
        options: [
          'Promover a emancipação crítica por meio do artesanato folclórico (Pegadinha)',
          'Padronizar os bens culturais em mercadorias de entretenimento, reduzindo o senso crítico',
        ],
        correctOptionIndex: 1,
      },
      keyFormulas: [
        'Durkheim: Fato Social (exterioridade, coercitividade e generalidade)',
        'Max Weber: Ação Social e tipos de dominação (tradicional, carismática e racional-legal)',
        'Escola de Frankfurt: Indústria Cultural padroniza a arte em mercadoria de consumo passivo',
        'Sérgio Buarque de Holanda: Patrimonialismo (confusão entre o público e o privado)',
      ],
      sections: [
        {
          heading: '1. Indústria Cultural e Sociedade do Consumo',
          body: 'Theodor Adorno e Max Horkheimer cunharam o termo "Indústria Cultural" para explicar como o cinema comercial, o rádio e a publicidade transformam bens culturais em produtos em série, anestesiando o senso crítico do indivíduo.',
        },
      ],
    },
  ],

  linguagens: [
    {
      id: 'teo-lc-1',
      discipline: 'linguagens',
      subject: 'Português',
      title: 'Funções da Linguagem e Estratégias de Interpretação',
      readingTime: '9 min de leitura',
      incidence: 'Presente em todas as provas de Linguagens',
      summary:
        'Identificação rápida das 6 funções de Jakobson em poemas, notícias, propagandas e tirinhas.',
      imageUrl: SVG_APOSTILA_REDACAO,
      imageCaption:
        'Domínio textual: identificar a intenção comunicativa (persuadir, informar, emocionar ou explicar o código) resolve as questões de funções da linguagem em segundos.',
      enemTrap: {
        title: 'Pegadinha Clássica: Marcar "Função Poética" Só Porque o Texto é um Poema',
        wrongThinking:
          'Ver um texto em versos (poema) que explica como fazer uma poesia ou o que é uma palavra e marcar automaticamente "Função Emotiva" ou "Poética" sem ler o comando.',
        correctThinking:
          'Se o poema está usando palavras para explicar a própria construção do poema, da escrita ou da língua, predomina a FUNÇÃO METALINGUÍSTICA (o código explicando o próprio código)!',
        quickQuestion:
          'Um poema descreve passo a passo como o poeta escolhe as rimas e constrói o próprio verso. Qual função se destaca nessa autorreflexão?',
        options: [
          'Função Fática, pois apenas testa o canal (Pegadinha)',
          'Função Metalinguística, pois a linguagem reflete sobre o próprio ato de escrever',
        ],
        correctOptionIndex: 1,
      },
      keyFormulas: [
        'Referencial: foco no assunto/informação objetiva (3ª pessoa, jornalismo científico)',
        'Conativa / Apelativa: foco no receptor (verbos no imperativo, propagandas e campanhas)',
        'Metalinguística: o código explicando o próprio código (poema sobre fazer poesia, dicionário)',
        'Fática: testa o canal de comunicação ("Alô?", "Né?", "Entende?")',
      ],
      sections: [
        {
          heading: '1. Como acertar questões de Campanhas Publicitárias',
          body: 'Em 95% das questões do ENEM que trazem cartazes de vacinação, doação de sangue, trânsito ou consumo consciente, o objetivo central é associar a linguagem não verbal (imagem) à função conativa/apelativa (verbos no imperativo) para sensibilizar e modificar o comportamento do cidadão.',
        },
      ],
    },
    {
      id: 'teo-lc-2',
      discipline: 'linguagens',
      subject: 'Sociolinguística',
      title: 'Variação Linguística e Patrimônio Linguístico',
      readingTime: '10 min de leitura',
      incidence: 'Top 2 em Linguagens no ENEM',
      summary:
        'Variantes diatópica (regional), diastrática (social), diafásica (registro formal/informal) e diacrônica (histórica).',
      imageUrl: SVG_APOSTILA_REDACAO,
      imageCaption:
        'Sociolinguística no ENEM: adequação ao contexto comunicativo e valorização das variedades regionais como patrimônio identitário.',
      enemTrap: {
        title: 'Pegadinha Clássica: Alternativas que Chamam a Fala Coloquial de "Erro"',
        wrongThinking:
          'Cair em alternativas com palavras aparentemente cultas que dizem que o falar regional ou popular "deturpa a pureza gramatical da língua portuguesa".',
        correctThinking:
          'O ENEM adota a visão da Sociolinguística Científica: NUNCA marque alternativas que falem em "empobrecimento da língua", "corrupção gramatical" ou "superioridade da norma culta". Procure termos como "identidade cultural", "adequação ao contexto" e "patrimônio linguístico".',
        quickQuestion:
          'Quando um personagem de cordel utiliza expressões típicas do sertão nordestino, essa variedade representa no ENEM:',
        options: [
          'Um desvio incorreto que prejudica a clareza da língua nacional (Pegadinha)',
          'Uma marca legítima de identidade regional (variação diatópica) e expressividade cultural',
        ],
        correctOptionIndex: 1,
      },
      keyFormulas: [
        'Diatópica (Geográfica): sotaques e vocabulários regionais (ex: mandioca, aipim, macaxeira)',
        'Diastrática (Social): gírias de grupos específicos ou jargões técnicos (juridiquês, linguagem médica)',
        'Diafásica (Situacional): o mesmo falante adapta a fala conforme o ambiente (conversa no WhatsApp vs. entrevista)',
        'Diacrônica (Histórica): evolução da língua no tempo (Vossa Mercê → Vosmicê → Você → cê)',
      ],
      sections: [
        {
          heading: '1. Adequação Linguística vs. Preconceito Linguístico',
          body: 'Na matriz do ENEM, não existe variedade linguística "superior" ou "inferior". A norma-padrão é fundamental para documentos oficiais e textos científicos, mas as variedades populares e regionais são plenamente eficazes e legítimas em seus contextos de uso.',
        },
      ],
    },
    {
      id: 'teo-lc-3',
      discipline: 'linguagens',
      subject: 'Literatura & Artes',
      title: 'Modernismo Brasileiro, Realismo e Arte Contemporânea',
      readingTime: '13 min de leitura',
      incidence: 'Alta incidência em Literatura e Artes',
      summary:
        '1ª Geração Modernista (liberdade formal e língua nacional), Romance de 30 (regionalismo crítico), ironia machadiana e arte interativa.',
      imageUrl: SVG_APOSTILA_REDACAO,
      imageCaption:
        'Vanguardas e Modernismo: da ruptura estética de 1922 à participação ativa do espectador nas instalações contemporâneas.',
      enemTrap: {
        title: 'Pegadinha Clássica: Confundir Antropofagia Modernista com "Rejeição Total ao Estrangeiro"',
        wrongThinking:
          'Achar que o Movimento Antropofágico de Oswald de Andrade propunha "isolar o Brasil e proibir qualquer influência artística europeia".',
        correctThinking:
          'Antropofagia não é fechar-se ao exterior, mas sim "deglutir" (absorver criticamente) a técnica estrangeira e misturá-la às raízes indígenas, afro-brasileiras e populares para criar uma arte nacional original!',
        quickQuestion:
          'O que significa o lema "Tupi or not tupi" no Manifesto Antropófago de Oswald de Andrade?',
        options: [
          'Proibir o estudo de línguas e técnicas estrangeiras no Brasil (Pegadinha)',
          'Assimilar criticamente a cultura externa, reinventando-a com identidade brasileira própria',
        ],
        correctOptionIndex: 1,
      },
      keyFormulas: [
        '1ª Fase Modernista (1922–1930): ruptura com o academicismo, verso livre, humor e Antropofagia',
        '2ª Fase Modernista — Prosa (1930–1945): denúncia social e regionalismo (Graciliano Ramos, Rachel de Queiroz)',
        'Realismo (Machado de Assis): análise psicológica, crítica à hipocrisia burguesa e ironia fina',
        'Arte Contemporânea: quebra a barreira obra/público (instalações, performances, arte efêmera)',
      ],
      sections: [
        {
          heading: '1. O Papel do Espectador na Arte Contemporânea',
          body: 'Diferentemente da arte clássica contemplativa exposta em molduras, a arte contemporânea (instalações, body art, arte urbana/grafite e arte digital) convida o espectador a interagir fisicamente e a refletir sobre o espaço cotidiano.',
        },
      ],
    },
    {
      id: 'teo-lc-4',
      discipline: 'linguagens',
      subject: 'Redação ENEM',
      title: 'Guia da Redação Nota 1000: Estrutura e as 5 Competências',
      readingTime: '15 min de leitura',
      incidence: 'Vale 1 000 pontos (20% da média final)',
      summary:
        'Domine o projeto de texto em 4 parágrafos, repertório sociocultural legitimado e os 5 elementos obrigatórios da Proposta de Intervenção (Competência 5).',
      imageUrl: SVG_APOSTILA_REDACAO,
      imageCaption:
        'Mapa dos 4 Parágrafos da Redação Nota 1000: Introdução com tese dupla, D1, D2 e Proposta de Intervenção com 5 elementos.',
      enemTrap: {
        title: 'Pegadinha Clássica: Esquecer o "Meio/Modo" ou Usar Agente Vago na Conclusão (C5)',
        wrongThinking:
          'Escrever na conclusão apenas "O governo deve criar campanhas para conscientizar a população" (faltam Meio/Modo e Detalhamento, perdendo 80 pontos na Competência 5).',
        correctThinking:
          'Sempre inclua os 5 elementos explícitos: 1) Agente específico (Ministério da Educação), 2) Ação (deve promover...), 3) Meio/Modo ("por meio de..."), 4) Efeito ("a fim de...") e 5) Detalhamento (explicação entre travessões ou vírgulas).',
        quickQuestion:
          'Qual expressão abaixo introduz corretamente o elemento MEIO/MODO na Proposta de Intervenção da Redação?',
        options: [
          '"Para que a sociedade melhore..." (Pegadinha: isso é Efeito/Finalidade, não Meio/Modo)',
          '"Por meio da destinação de verbas públicas e oficinas nas escolas..." (Meio/Modo correto)',
        ],
        correctOptionIndex: 1,
      },
      keyFormulas: [
        'Parágrafo 1 (Introdução): Contextualização + Tema completo + Tese com 2 argumentos (A1 e A2)',
        'Parágrafos 2 e 3 (Desenvolvimento): Tópico frasal + Repertório produtivo + Argumentação crítica + Fechamento',
        'Parágrafo 4 (Conclusão — C5): Agente + Ação + Meio/Modo + Efeito + Detalhamento',
        'Conectivos Interparágrafos: "Nesse cenário..." (D1), "Ademais..." (D2), "Portanto..." (Conclusão)',
      ],
      sections: [
        {
          heading: '1. Os 5 Elementos Obrigatórios da Competência 5 (200 pontos)',
          body: 'Para garantir 200 pontos na conclusão, responda às 5 perguntas: 1) QUEM fará? (Agente: Ministério da Educação, Mídia, Poder Legislativo); 2) O QUE fará? (Ação concreta: promover campanhas, criar projeto de lei); 3) COMO fará? (Meio/Modo: por meio de verbas públicas, mediante parcerias com escolas); 4) PARA QUÊ? (Efeito/Finalidade: a fim de mitigar a invisibilidade...); 5) DETALHAMENTO de um dos elementos (ex: explicação ou exemplificação entre travessões ou oração adjetiva).',
        },
        {
          heading: '2. Repertórios Coringas Legitimados para o ENEM',
          body: 'Constituição Federal de 1988 (Art. 5º e Art. 6º — contraste entre o direito garantido no papel e a falha na prática, a "Cidadania de Papel" de Gilberto Dimenstein); Zygmunt Bauman ("Modernidade Líquida" e "Instituições Zumbis"); Hannah Arendt ("Banalidade do Mal") e Ailton Krenak ("Ideias para Adiar o Fim do Mundo" — sustentabilidade e povos originários).',
        },
      ],
    },
  ],
};

// Catálogo de Provas Oficiais organizadas estritamente por Ano e Cor da Prova
export const OFFICIAL_EXAMS = [
  {
    id: 'prova-2024-azul',
    year: 2024,
    bookletColor: 'Azul',
    title: 'ENEM 2024 — Caderno 1 Azul (Aplicação Regular)',
    subtitle: 'Matemática, Ciências da Natureza, Ciências Humanas e Linguagens do Caderno Azul.',
    estimatedSizeKb: 215,
  },
  {
    id: 'prova-2024-amarela',
    year: 2024,
    bookletColor: 'Amarela',
    title: 'ENEM 2024 — Caderno 2 Amarelo (Aplicação Regular)',
    subtitle: 'Questões oficiais de Matemática, Química, Geografia e Linguagens do Caderno Amarelo.',
    estimatedSizeKb: 198,
  },
  {
    id: 'prova-2024-branca',
    year: 2024,
    bookletColor: 'Branca',
    title: 'ENEM 2024 — Caderno 3 Branco (Aplicação Regular)',
    subtitle: 'Funções Quadráticas, Trajetória Parabólica e Modelagem Matemática.',
    estimatedSizeKb: 164,
  },
  {
    id: 'prova-2024-rosa',
    year: 2024,
    bookletColor: 'Rosa',
    title: 'ENEM 2024 — Caderno 4 Rosa (Ciências da Natureza)',
    subtitle: 'Caderno oficial Rosa com ênfase em Biologia, Ecologia e Ciclo do Nitrogênio.',
    estimatedSizeKb: 152,
  },
  {
    id: 'prova-2023-azul',
    year: 2023,
    bookletColor: 'Azul',
    title: 'ENEM 2023 — Caderno 1 Azul (1º e 2º Dias)',
    subtitle: 'Escalas Cartográficas, Geometria e Patrimônio Cultural Imaterial.',
    estimatedSizeKb: 180,
  },
  {
    id: 'prova-2023-amarela',
    year: 2023,
    bookletColor: 'Amarela',
    title: 'ENEM 2023 — Caderno 2 Amarelo (Ciências da Natureza)',
    subtitle: 'Eletrodinâmica, Potência Elétrica e Dimensionamento Residencial.',
    estimatedSizeKb: 148,
  },
  {
    id: 'prova-2023-branca',
    year: 2023,
    bookletColor: 'Branca',
    title: 'ENEM 2023 — Caderno 3 Branco (1º e 2º Dias)',
    subtitle: 'Probabilidade, Imunologia, Filosofia Contratualista e Sociolinguística.',
    estimatedSizeKb: 224,
  },
  {
    id: 'prova-2023-rosa',
    year: 2023,
    bookletColor: 'Rosa',
    title: 'ENEM 2023 — Caderno 4 Rosa (Linguagens e Literatura)',
    subtitle: 'Modernismo Brasileiro (Oswald de Andrade) e Interpretação Literária.',
    estimatedSizeKb: 140,
  },
  {
    id: 'prova-2022-azul',
    year: 2022,
    bookletColor: 'Azul',
    title: 'ENEM 2022 — Caderno 1 Azul (Linguagens & Redação)',
    subtitle: 'Operadores Argumentativos, Coesão Sequencial e Estrutura Textual.',
    estimatedSizeKb: 136,
  },
  {
    id: 'prova-2022-amarela',
    year: 2022,
    bookletColor: 'Amarela',
    title: 'ENEM 2022 — Caderno 2 Amarelo (Linguagens & Artes)',
    subtitle: 'Arte Contemporânea, Instalações Interativas e Cultura Digital.',
    estimatedSizeKb: 142,
  },
  {
    id: 'prova-2022-branca',
    year: 2022,
    bookletColor: 'Branca',
    title: 'ENEM 2022 — Caderno 3 Branco (Ciências Humanas)',
    subtitle: 'Antiguidade Clássica, Democracia Ateniense e Cidadania.',
    estimatedSizeKb: 145,
  },
  {
    id: 'prova-2022-rosa',
    year: 2022,
    bookletColor: 'Rosa',
    title: 'ENEM 2022 — Caderno 4 Rosa (Aplicação Regular)',
    subtitle: 'Geometria Espacial, Estequiometria Química e Era Vargas.',
    estimatedSizeKb: 190,
  },
];
