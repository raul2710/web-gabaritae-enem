import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Timer } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Simulados',
};

const FEATURES = [
  'Escolha as áreas e quantas questões quer por simulado',
  'Cronômetro com tempo sugerido por prova oficial',
  'Resultado por área no fim, direto para o seu score',
];

export default function AppSimuladosPage() {
  return (
    <section className="section">
      <header className="page-hero">
        <span className="section-header__eyebrow">Área do aluno</span>
        <h1 className="page-hero__title">Simulado personalizado</h1>
        <p className="page-hero__description">
          Monte uma prova sob medida: áreas, dificuldade e tempo. Como no dia do ENEM, com resultado
          por matéria no fim.
        </p>
      </header>

      <div className="card" style={{ marginTop: 'var(--space-lg)', maxWidth: '720px' }}>
        <span className="section-header__eyebrow">
          <Timer size={14} aria-hidden="true" style={{ verticalAlign: '-2px' }} /> Como vai
          funcionar
        </span>

        <ul className="auth-benefits" style={{ marginTop: 'var(--space-md)' }}>
          {FEATURES.map((feature) => (
            <li key={feature} className="auth-benefits__item">
              <CheckCircle2 className="auth-benefits__icon" size={18} aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <p className="meta" style={{ marginTop: 'var(--space-md)' }}>
          O gerador de simulados completo será implementado na próxima fase. Enquanto isso, você já
          pode treinar com as provas oficiais do acervo.
        </p>

        <div className="row" style={{ marginTop: 'var(--space-md)' }}>
          <Link href="/provas" className="btn btn--primary">
            Treinar com provas oficiais
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link href="/app" className="btn btn--ghost">
            Voltar ao início
          </Link>
        </div>
      </div>
    </section>
  );
}
