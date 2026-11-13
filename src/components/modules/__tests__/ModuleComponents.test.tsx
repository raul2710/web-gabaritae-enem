// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RadarPegadinhaCard } from '../RadarPegadinhaCard';
import { ItemFixacaoInteractive } from '../ItemFixacaoInteractive';
import type { ItemFixacao } from '@/domain/types';

describe('RadarPegadinhaCard', () => {
  it('exibe o pensamento errado e o pensamento correto', () => {
    render(
      <RadarPegadinhaCard
        title="Pegadinha de Ondulatória"
        wrongThinking="Achar que a frequência muda na refração."
        correctThinking="A frequência é constante; mudam a velocidade e o comprimento de onda."
      />,
    );

    expect(screen.getByText(/Pegadinha de Ondulatória/i)).toBeDefined();
    expect(screen.getByText(/Achar que a frequência muda na refração/i)).toBeDefined();
    expect(screen.getByText(/A frequência é constante/i)).toBeDefined();
  });

  it('permite responder ao mini-quiz interativo', () => {
    render(
      <RadarPegadinhaCard
        title="Pegadinha de TRI"
        wrongThinking="Erro"
        correctThinking="Certo"
        quickQuiz={{
          question: 'Na refração, o que NÃO se altera?',
          options: ['Velocidade', 'Frequência', 'Comprimento de onda'],
          correctIndex: 1,
        }}
      />,
    );

    expect(screen.getByText(/Na refração, o que NÃO se altera\?/i)).toBeDefined();

    const opcaoCorreta = screen.getByText('Frequência');
    fireEvent.click(opcaoCorreta);

    expect(screen.getByText(/Você identificou o raciocínio correto/i)).toBeDefined();
  });
});

describe('ItemFixacaoInteractive', () => {
  const fakeItem: ItemFixacao = {
    referencia: 'ENEM 2023 - Questão 100',
    ano: 2023,
    aplicacao: 'Regular',
    corCaderno: 'Azul',
    numeroQuestao: 100,
    enunciado: 'Qual a velocidade da luz no vácuo?',
    alternativas: [
      '300.000 km/s',
      '150.000 km/s',
      '1.000 km/s',
      '3.000 km/s',
      'Zero',
    ],
    gabaritoOficial: 'A',
    resolucaoComentada: 'A velocidade da luz no vácuo é aproximadamente $c = 3 \\cdot 10^8\\text{ m/s} = 300.000\\text{ km/s}$.',
  };

  it('valida alternativa correta e abre resolução comentada', () => {
    render(<ItemFixacaoInteractive item={fakeItem} fontesCanonicas={['https://inep.gov.br']} />);

    expect(screen.getByText(/ENEM 2023 - Questão 100/i)).toBeDefined();
    expect(screen.getByText(/Qual a velocidade da luz no vácuo\?/i)).toBeDefined();

    // Clica na alternativa A
    const btnA = screen.getByRole('button', { name: /Alternativa A/i });
    fireEvent.click(btnA);

    // Clica em confirmar
    const btnConfirm = screen.getByRole('button', { name: /Confirmar e Validar Resposta/i });
    fireEvent.click(btnConfirm);

    // Mostra acerto e resolução
    expect(screen.getByText(/Você acertou! Gabarito oficial:/i)).toBeDefined();
    expect(screen.getByText(/Resolução Oficial Comentada/i)).toBeDefined();
    expect(screen.getByText(/https:\/\/inep.gov.br/i)).toBeDefined();
  });
});
