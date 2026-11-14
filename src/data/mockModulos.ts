import type { ModuloDidatico, PixInfo } from '@/domain/types';

export const OFFICIAL_PIX_FALLBACK: PixInfo = {
  pixKey: 'd0bbcb4c-83bf-4687-b928-891febf51214',
  keyType: 'Aleatória (EVP)',
  merchantName: 'Gabaritaê ENEM Educação',
  merchantCity: 'Brasília - DF',
  amount: 19.90,
  txId: 'APOIOENEM',
  pixCopiaECola:
    '00020126580014BR.GOV.BCB.PIX0136d0bbcb4c-83bf-4687-b928-891febf51214520400005303986540519.905802BR5923Gabaritae ENEM Educacao6008BRASILIA62130509APOIOENEM6304AC1C',
};

export const MOCK_MODULOS_DIDATICOS: ModuloDidatico[] = [
  {
    id: 'MOD-MAT-C3H11-01',
    tituloTematico: 'Funções Exponenciais e Crescimento Bacteriano',
    area: 'Matemática',
    disciplina: 'Matemática',
    competencia: 'Competência de Área 3',
    habilidade: 'Habilidade 11 - Utilizar a noção de variação de grandezas para a compreensão da realidade e a solução de problemas modernos.',
    recorrencia: 'Alta',
    fontesCanonicas: [
      'https://download.inep.gov.br/educacao_basica/enem/provas/2023/CAD_ENEM_2023_DIA_2_AZUL.pdf',
      'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/matriz-de-referencia',
    ],
    fundamentacaoTeorica: `### Dinâmica do Crescimento Exponencial

O modelo de crescimento exponencial é fundamental na análise de fenômenos biológicos, demográficos e de juros compostos. No contexto do ENEM, o modelo clássico é descrito pela equação:

$$N(t) = N_0 \\cdot a^{k \\cdot t}$$

Onde:
- $N_0$ representa a **população inicial** no instante $t = 0$;
- $a$ é a **base de crescimento** (frequentemente $a = 2$ para duplicação ou $e \\approx 2{,}718$ para crescimento contínuo);
- $k$ é a **taxa específica de reprodução**;
- $t$ é o **tempo decorrido** nas mesmas unidades de referência.

#### Taxa de Duplicação e Meia-Vida
Quando uma colônia de bactérias dobra a cada período $T$, a relação expressa-se diretamente por:

$$N(t) = N_0 \\cdot 2^{\\frac{t}{T}}$$

> **Importante para o ENEM**: O ENEM costuma exigir que o candidato aplique logaritmos para encontrar o tempo $t$ quando $N(t)$ é dado: $\\log(N/N_0) = \\frac{t}{T} \\cdot \\log(2)$.`,
    elementoVisualOriginal: {
      urlImagem: 'https://download.inep.gov.br/educacao_basica/enem/provas/2023/CAD_ENEM_2023_DIA_2_AZUL.pdf',
      altTextAnalitico: 'Gráfico em coordenadas cartesianas mostrando a curva assintótica de crescimento bacteriano com início em N0=100 e duplicação a cada 20 minutos.',
    },
    esquemaConceitual: {
      objetivoPedagogico: 'Compreender como grandezas se multiplicam em intervalos regulares e distinguir progressão geométrica de aritmética no plano cartesiano.',
      promptIngles: 'A scientific pedagogical infographic illustrating exponential bacterial growth: initial cluster of 100 bacteria doubling at regular 20-minute intervals on a petri dish alongside an exponential coordinate graph.',
      promptPortugues: 'Infográfico pedagógico científico ilustrando crescimento bacteriano exponencial: colônia inicial de 100 bactérias duplicando a cada 20 minutos em placa de Petri ao lado de gráfico cartesiano com curva exponencial ascendente.',
      roteiroEstrutural: {
        elementoCentral: 'Equação Fundamental de População: N(t) = N0 * 2^(t/T)',
        fluxosERelacoes: 'Tempo (t) em progressão aritmética [0, 20, 40, 60 min] -> População N(t) em progressão geométrica [100, 200, 400, 800 bactérias]',
        legendaExplicativa: 'O crescimento exponencial acelera com o tempo porque a taxa de variação instantânea dN/dt é diretamente proporcional ao tamanho atual da população.',
      },
    },
    comoCostumaCair: 'O ENEM contextualiza problemas com colônias de bactérias, disseminação viral ou decaimento radioativo (tempo de meia-vida). As questões cobram a identificação da lei de formação matemática e a leitura de eixos em escala linear ou logarítmica.',
    distratoresComuns: 'O erro mais comum é confundir taxa constante de adição (crescimento linear / PA) com taxa multiplicativa (crescimento exponencial / PG), somando o valor inicial em vez de multiplicá-lo recursivamente.',
    itemFixacao: {
      referencia: 'ENEM 2023 - Caderno Azul - Questão 142',
      ano: 2023,
      aplicacao: 'Regular',
      corCaderno: 'Azul',
      numeroQuestao: 142,
      enunciado: 'Uma colônia de bactérias tem inicialmente 200 indivíduos e dobra de tamanho a cada 3 horas. Qual expressão representa a quantidade de bactérias N após t horas?',
      alternativas: [
        'N(t) = 200 + 2^(t/3)',
        'N(t) = 200 . 2^(t/3)',
        'N(t) = 200 . (2/3)^t',
        'N(t) = 200 + 3 . 2^t',
        'N(t) = 200 . 3^(2t)',
      ],
      gabaritoOficial: 'B',
      resolucaoComentada: 'Para $t = 0$, temos $N(0) = 200$. Para $t = 3$ horas (1 período), temos $N(3) = 200 \\cdot 2^1 = 400$. Para $t = 6$ horas (2 períodos), temos $N(6) = 200 \\cdot 2^2 = 800$. Generalizando para qualquer tempo $t$, o expoente da base 2 é o número de períodos decorridos $\\frac{t}{3}$, resultando na expressão $N(t) = 200 \\cdot 2^{\\frac{t}{3}}$. Alternativa B.',
    },
    apostilaId: 'mat-funcoes',
    questionId: 'enem-2023-mat-142',
  },
  {
    id: 'MOD-NAT-C1H01-02',
    tituloTematico: 'Eletrodinâmica: Circuitos Mistos e Potência Dissipada',
    area: 'Ciências da Natureza',
    disciplina: 'Física',
    competencia: 'Competência de Área 1',
    habilidade: 'Habilidade 1 - Reconhecer características ou propriedades de fenômenos ondulatórios ou mecânicos e transformações elétricas no cotidiano.',
    recorrencia: 'Alta',
    fontesCanonicas: [
      'https://download.inep.gov.br/educacao_basica/enem/provas/2023/CAD_ENEM_2023_DIA_2_AZUL.pdf',
      'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem',
    ],
    fundamentacaoTeorica: `### Leis de Ohm e Associação de Resistores

Em circuitos elétricos do ENEM, a dissipação de energia térmica por Efeito Joule é dada por:

$$P = U \\cdot I = R \\cdot I^2 = \\frac{U^2}{R}$$

#### Associação em Série vs Paralelo
1. **Série**: A corrente $I$ é idêntica em todos os resistores:
   $$R_{eq} = R_1 + R_2 + \\dots + R_n$$
   $$U_{total} = U_1 + U_2 + \\dots + U_n$$

2. **Paralelo**: A d.d.p. $U$ é idêntica nas ramificações:
   $$\\frac{1}{R_{eq}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\dots + \\frac{1}{R_n}$$
   $$I_{total} = I_1 + I_2 + \\dots + I_n$$

> **Dica TRI de Ouro**: Lâmpadas ligadas à mesma rede domiciliar ($127\\text{ V}$ ou $220\\text{ V}$) estão sempre em paralelo. A de maior potência consome maior corrente e possui **menor** resistência ($R = \\frac{U^2}{P}$).`,
    elementoVisualOriginal: {
      urlImagem: 'https://download.inep.gov.br/educacao_basica/enem/provas/2022/CAD_ENEM_2022_DIA_2_AZUL.pdf',
      altTextAnalitico: 'Diagrama elétrico esquemático com fonte de 12V conectada a um resistor R1 de 4 ohms em série com um bloco em paralelo contendo R2=6 ohms e R3=3 ohms.',
    },
    esquemaConceitual: {
      objetivoPedagogico: 'Distinguir o comportamento da tensão (U) e da corrente (I) em ligações em série versus ligações em paralelo.',
      promptIngles: 'A clean educational circuit diagram comparing series and parallel connections with glowing lightbulbs, multimeters measuring current and voltage, with color-coded current paths.',
      promptPortugues: 'Diagrama esquemático de circuito elétrico limpo comparando ligação em série e paralelo com lâmpadas incandescentes acesas, voltímetros e amperímetros ilustrando a divisão da ddp e corrente.',
      roteiroEstrutural: {
        elementoCentral: 'Primeira e Segunda Lei de Ohm: U = R * I e P = U^2 / R',
        fluxosERelacoes: 'Fonte (U constante) -> Ramo Paralelo (mesma U, correntes somam) -> Ramo Série (mesma I, tensões somam)',
        legendaExplicativa: 'Em instalações residenciais, os aparelhos ficam em paralelo para operarem na mesma tensão nominal de forma independente.',
      },
    },
    comoCostumaCair: 'O Inep adora situações do cotidiano como chuveiros de verão/inverno, lâmpadas de árvore de natal (série) e circuitos residenciais (paralelo), cobrando qual lâmpada brilha mais ou qual fusível suporta a carga.',
    distratoresComuns: 'Achar que a lâmpada com maior resistência brilha mais em um circuito residencial. Como a tensão é constante, a potência é inversamente proporcional à resistência.',
    itemFixacao: {
      referencia: 'ENEM 2022 - Caderno Azul - Questão 115',
      ano: 2022,
      aplicacao: 'Regular',
      corCaderno: 'Azul',
      numeroQuestao: 115,
      enunciado: 'Dois resistores de resistências R1 = 6 Ω e R2 = 3 Ω são ligados em paralelo a uma bateria de 12 V de resistência interna desprezível. Qual é a corrente total fornecida pela bateria?',
      alternativas: [
        '2 A',
        '4 A',
        '6 A',
        '9 A',
        '18 A',
      ],
      gabaritoOficial: 'C',
      resolucaoComentada: 'Primeiro calculamos a resistência equivalente em paralelo: $R_{eq} = \\frac{R_1 \\cdot R_2}{R_1 + R_2} = \\frac{6 \\cdot 3}{6 + 3} = \\frac{18}{9} = 2\\ \\Omega$. Aplicando a 1ª Lei de Ohm: $I_{total} = \\frac{U}{R_{eq}} = \\frac{12\\text{ V}}{2\\ \\Omega} = 6\\text{ A}$. Portanto, a alternativa correta é a C.',
    },
    apostilaId: 'nat-eletro',
    questionId: 'enem-2022-nat-115',
  },
  {
    id: 'MOD-HUM-C2H08-03',
    tituloTematico: 'Cidadania e Direitos na Grécia Antiga vs. Modernidade',
    area: 'Ciências Humanas',
    disciplina: 'História',
    competencia: 'Competência de Área 2',
    habilidade: 'Habilidade 8 - Analisar a ação dos estados nacionais no que se refere à dinâmica dos fluxos populacionais e às regras de enfrentamento das tensões de poder.',
    recorrencia: 'Média',
    fontesCanonicas: [
      'https://download.inep.gov.br/educacao_basica/enem/provas/2023/CAD_ENEM_2023_DIA_1_AZUL.pdf',
      'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem',
    ],
    fundamentacaoTeorica: `### A Democracia Ateniense e seus Limites Estruturais

A democracia em Atenas clássica ($século\\ V\\ a.C.$) consolidou-se sob a égide da **isonomia** (igualdade perante a lei) e da **isegoria** (igual direito à palavra na *Eclésia*).

Contudo, a cidadania ateniense era estritamente excludente:
- **Cidadãos**: Apenas homens livres, maiores de idade (18 a 20 anos), filhos de pai e mãe atenienses;
- **Excluídos**: Mulheres, escravizados e metecos (estrangeiros residentes).

#### Comparação Histórica: Democracia Direta vs. Representativa
| Critério | Atenas Clássica | Democracia Contemporânea |
| :--- | :--- | :--- |
| **Formato** | Direta (ágora / praça pública) | Representativa (eleições periódicas) |
| **Escopo** | Restrita a ~10% da população | Universal (sufrágio universal sem distinção de gênero/renda) |
| **Trabalho** | Sustentada pelo trabalho escravo | Relações de trabalho assalariado regulamentadas |`,
    elementoVisualOriginal: {
      urlImagem: 'https://download.inep.gov.br/educacao_basica/enem/provas/2023/CAD_ENEM_2023_DIA_1_AZUL.pdf',
      altTextAnalitico: 'Gravura histórica representando a Assembleia do Povo (Eclésia) reunida na colina da Pnyx em Atenas com orador na tribuna.',
    },
    esquemaConceitual: {
      objetivoPedagogico: 'Compreender o conceito de cidadania em sua historicidade, identificando permanências e rupturas entre a antiguidade clássica e a contemporaneidade.',
      promptIngles: 'A historical analytical diagram contrasting the restricted Athenian Agora citizen body against a modern diverse voting booth representing universal suffrage.',
      promptPortugues: 'Diagrama comparativo analítico histórico contrastando o corpo restrito de cidadãos da Ágora ateniense com uma urna eleitoral moderna representando o sufrágio universal.',
      roteiroEstrutural: {
        elementoCentral: 'Conceito Histórico de Cidadania e Espaço Público',
        fluxosERelacoes: 'Atenas (Democracia Direta + Exclusão de Mulheres, Escravos e Metecos) -> Ruptura Iluminista -> Democracia Contemporânea (Sufrágio Universal + Direitos Humanos)',
        legendaExplicativa: 'Apesar de criar a participação política direta, o modelo grego dependia da exploração escravista para que os cidadãos tivessem ócio produtivo para a política.',
      },
    },
    comoCostumaCair: 'O ENEM costuma apresentar textos filosóficos (Aristóteles, Platão, Chaui, Habermas) confrontando a exclusão dos subalternos na pólis clássica com as lutas pelos direitos civis modernos.',
    distratoresComuns: 'Anacronismo histórico: projetar os valores contemporâneos de direitos humanos e universalidade para o período clássico da antiguidade grega.',
    itemFixacao: {
      referencia: 'ENEM 2023 - Caderno Azul - Questão 54',
      ano: 2023,
      aplicacao: 'Regular',
      corCaderno: 'Azul',
      numeroQuestao: 54,
      enunciado: 'Em Atenas do século V a.C., o exercício da cidadania na pólis grega caracterizava-se fundamentalmente por:',
      alternativas: [
        'Ser estendido a todos os trabalhadores assalariados urbanos e camponeses da Ática.',
        'Permitir a participação direta nas decisões políticas para um grupo restrito de homens livres e proprietários.',
        'Incluir mulheres atenienses como legisladoras na assembleia popular (Eclésia).',
        'Abolir a escravidão por dívidas e transformar os escravizados em cidadãos de plenos direitos.',
        'Instituir eleições indiretas para a escolha de representantes de toda a confederação.',
      ],
      gabaritoOficial: 'B',
      resolucaoComentada: 'A democracia ateniense era direta e participativa para os cidadãos, mas estes compunham uma minoria (homens livres, atenienses e adultos). Mulheres, escravos e metecos estavam completamente excluídos dos direitos políticos. Portanto, a alternativa B é a única correta.',
    },
    apostilaId: 'hum-grecia',
    questionId: 'enem-2023-hum-54',
  },
];
