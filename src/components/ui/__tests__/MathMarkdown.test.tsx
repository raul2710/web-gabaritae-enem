// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MathMarkdown } from '../MathMarkdown';
import { SmartMediaViewer } from '../SmartMediaViewer';

describe('MathMarkdown (KaTeX & Markdown Pipeline)', () => {
  it('renderiza fórmulas matemáticas inline com KaTeX', () => {
    const { container } = render(<MathMarkdown content="A fórmula de Einstein é $E = mc^2$." />);
    
    // Verifica se a classe math-inline e elementos do KaTeX foram gerados
    expect(container.querySelector('.math-inline')).not.toBeNull();
    expect(container.querySelector('.katex')).not.toBeNull();
  });

  it('renderiza blocos matemáticos display com KaTeX', () => {
    const { container } = render(
      <MathMarkdown content="Lei de Coulomb: \n\n$$F = k \\cdot \\frac{q_1 \\cdot q_2}{d^2}$$" />,
    );

    expect(container.querySelector('.math-display')).not.toBeNull();
    expect(container.querySelector('.katex-display')).not.toBeNull();
  });

  it('formata cabeçalhos e negritos em Markdown', () => {
    render(
      <MathMarkdown content="### Termologia Clássica\n\n**Atenção:** calor específico sensível." />,
    );

    expect(screen.getByRole('heading', { level: 3, name: /Termologia Clássica/i })).toBeDefined();
    expect(screen.getByText(/Atenção:/i)).toBeDefined();
  });
});

describe('SmartMediaViewer', () => {
  it('renderiza tag img para imagens diretas', () => {
    const { container } = render(
      <SmartMediaViewer
        url="https://exemplo.com/grafico.png"
        altText="Gráfico cartesiano"
        caption="Figura 1: Curva de Gauss"
      />,
    );

    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('src')).toBe('https://exemplo.com/grafico.png');
    expect(screen.getByText(/Figura 1: Curva de Gauss/i)).toBeDefined();
  });

  it('renderiza selo de PDF do Inep e Alt-Text Analítico para URLs de PDF', () => {
    render(
      <SmartMediaViewer
        url="https://download.inep.gov.br/provas/CAD_ENEM_2023.pdf"
        altText="Esquema elétrico com gerador de 12V e lâmpadas em paralelo."
      />,
    );

    const pdfLink = screen.getByRole('link', { name: /Abrir Prova Oficial do Inep \(PDF\)/i });
    expect(pdfLink).toBeDefined();
    expect(pdfLink.getAttribute('href')).toBe('https://download.inep.gov.br/provas/CAD_ENEM_2023.pdf');
    expect(pdfLink.getAttribute('target')).toBe('_blank');

    expect(screen.getByText(/Esquema elétrico com gerador de 12V/i)).toBeDefined();
    expect(screen.getByText(/Alt-Text Analítico Curado/i)).toBeDefined();
  });
});
