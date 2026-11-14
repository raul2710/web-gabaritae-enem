import type { Metadata } from 'next';
import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Compass,
  Heart,
  NotebookPen,
  Rocket,
  Sparkles,
  Target,
} from 'lucide-react';
import { redirect } from 'next/navigation';

import { PixButton } from '@/components/pix/PixButton';
import { Badge } from '@/components/ui/Badge';
import { getSession } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Info · Sobre o Gabaritaê',
};

const SITE_PILLARS = [
  {
    icon: ClipboardList,
    title: 'Provas Oficiais e Gabarito Comentado',
    description:
      'Acesso direto aos cadernos oficiais do ENEM organizados por ano, cor e área do conhecimento, com correção imediata e explicação passo a passo de cada alternativa.',
  },
  {
    icon: BookOpen,
    title: 'Estudo Direcionado por Habilidades',
    description:
      'Módulos teóricos curados com base na Matriz de Referência do Inep, destacando a recorrência estatística de cada tema, fórmulas essenciais e o Radar Anti-Pegadinhas.',
  },
  {
    icon: NotebookPen,
    title: 'Raio-X Visual e Caderno de Resumos',
    description:
      'Mapas visuais prontos com o que mais cai em cada dia de prova e um caderno pessoal para anotar, fixar e salvar seus próprios resumos de véspera.',
  },
  {
    icon: Target,
    title: 'Foco na Sua Nota de Corte (SISU)',
    description:
      'Acompanhamento de meta por curso e universidade desejada, estimativa de evolução e contagem regressiva para manter o ritmo na reta final.',
  },
];

const ROADMAP_GOALS = [
  'Simulados personalizados com cronômetro oficial e cálculo de proficiência inspirado na TRI (Teoria de Resposta ao Item).',
  'Integração completa com API de geração de trilhas adaptativas baseadas nas questões que o aluno mais erra.',
  'Correção estruturada de Redação por competência (C1 a C5) com banco de repertórios socioculturais.',
  'Modo 100% offline expandido para estudar em qualquer lugar, no computador ou celular, sem depender de conexão.',
  'Manter o acesso aberto, rápido, sem anúncios intrusivos e focado em democratizar a aprovação no ensino superior.',
];

export default async function AppInfoPage() {
  const user = await getSession();
  if (!user) redirect('/entrar?next=/app/info');

  return (
    <section className="section">
      <header className="page-hero">
        <span className="section-header__eyebrow">Sobre a plataforma</span>
        <h1 className="page-hero__title">Informações e Pretensões do Gabaritaê</h1>
        <p className="page-hero__description">
          O Gabaritaê nasceu com um propósito claro: transformar a preparação para o ENEM em uma
          jornada leve, visual, direta ao ponto e acessível para quem busca realizar o sonho da
          aprovação.
        </p>
      </header>

      {/* O que o site oferece hoje */}
      <div className="info-section" style={{ marginTop: 'var(--space-lg)' }}>
        <div className="section-header">
          <div className="section-header__text">
            <span className="section-header__eyebrow">
              <Compass size={14} aria-hidden="true" style={{ display: 'inline', marginRight: 4 }} />
              Como funciona hoje
            </span>
            <h2>O que você encontra no Gabaritaê</h2>
            <p className="section-header__description">
              Todas as ferramentas pensadas para você estudar sem distrações e focar no que realmente
              pontua na prova.
            </p>
          </div>
        </div>

        <div className="notes-grid">
          {SITE_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article key={pillar.title} className="card info-pillar-card">
                <div className="row" style={{ gap: 'var(--space-sm)' }}>
                  <span className="goal-card__badge-icon" aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  <h3 style={{ fontSize: 'var(--text-h3)' }}>{pillar.title}</h3>
                </div>
                <p className="meta" style={{ marginTop: 'var(--space-sm)', lineHeight: 1.65 }}>
                  {pillar.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>

      {/* Pretensões e Futuro do Projeto */}
      <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
        <div className="row" style={{ gap: 'var(--space-xs)', marginBottom: 'var(--space-xs)' }}>
          <Badge tone="primary">
            <Rocket size={13} aria-hidden="true" />
            Visão & Futuro
          </Badge>
          <Badge>
            <Sparkles size={13} aria-hidden="true" />
            Evolução contínua
          </Badge>
        </div>

        <h2 style={{ marginTop: 'var(--space-xs)' }}>Nossas pretensões para o projeto</h2>
        <p className="meta" style={{ marginTop: 'var(--space-xs)' }}>
          Estamos construindo uma plataforma de estudo cada vez mais completa. Confira os próximos
          passos planejados:
        </p>

        <ul className="auth-benefits" style={{ marginTop: 'var(--space-md)' }}>
          {ROADMAP_GOALS.map((goal) => (
            <li key={goal} className="auth-benefits__item">
              <CheckCircle2 className="auth-benefits__icon" size={18} aria-hidden="true" />
              <span>{goal}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Apoie esse projeto com Pix */}
      <div className="card info-support-card" style={{ marginTop: 'var(--space-lg)' }}>
        <span className="section-header__eyebrow">Comunidade & Manutenção</span>
        <h2 style={{ marginTop: 'var(--space-xs)' }}>Apoie esse projeto</h2>
        <p className="meta" style={{ marginTop: 'var(--space-xs)', maxWidth: '64ch' }}>
          O Gabaritaê é um projeto independente feito com dedicação para ajudar estudantes em todo o
          Brasil. Se a plataforma está te ajudando nos estudos e você quiser contribuir com qualquer
          valor para manter o site no ar e em constante evolução, apoie via Pix:
        </p>

        <div className="row" style={{ marginTop: 'var(--space-md)' }}>
          <PixButton variant="primary" label="Apoie com Pix" />
        </div>
      </div>

      {/* Declaração abaixo do Apoie */}
      <div
        className="sidebar__tribute info-tribute-card"
        role="region"
        aria-label="Dedicatória de amor"
        style={{ marginTop: 'var(--space-lg)' }}
      >
        <div className="sidebar__tribute-header">
          <Heart
            size={18}
            className="sidebar__tribute-heart"
            aria-hidden="true"
            fill="currentColor"
          />
          <span className="sidebar__tribute-tag">Feito com Amor</span>
        </div>
        <p className="sidebar__tribute-text" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
          Criado para ajudar minha namorada e futura esposa Isabelle, a alcançar seus objetivos,
          estudando de forma fácil.
        </p>
        <span className="sidebar__tribute-quote" style={{ fontSize: '0.875rem' }}>
          Para o meu amor gabaritar aê! ❤️
        </span>
      </div>
    </section>
  );
}
