'use client';

import React, { useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Code2,
  ExternalLink,
  Flame,
  Layers,
  Sparkles,
} from 'lucide-react';

import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { MathMarkdown } from '@/components/ui/MathMarkdown';
import { SmartMediaViewer } from '@/components/ui/SmartMediaViewer';
import type { ModuloDidatico } from '@/domain/types';
import { EsquemaConceitualCard } from './EsquemaConceitualCard';
import { ItemFixacaoInteractive } from './ItemFixacaoInteractive';
import { NotebookLMButton } from './NotebookLMButton';
import { RadarPegadinhaCard } from './RadarPegadinhaCard';

interface ModuloDidaticoDetailProps {
  modulo: ModuloDidatico;
  className?: string;
}

export function ModuloDidaticoDetail({
  modulo,
  className = '',
}: ModuloDidaticoDetailProps) {
  const [showJsonRaw, setShowJsonRaw] = useState(false);

  const recurrenceTone: BadgeTone =
    modulo.recorrencia === 'Alta'
      ? 'negative'
      : modulo.recorrencia === 'Média'
        ? 'warning'
        : 'neutral';

  return (
    <article className={`modulo-didatico-detail ${className}`} aria-labelledby={`title-${modulo.id}`}>
      {/* Cabeçalho Inep + Metadados */}
      <header className="modulo-header">
        <div className="modulo-top-row">
          <Badge tone="primary">{modulo.area}</Badge>
          <Badge>{modulo.disciplina}</Badge>
          <Badge tone={recurrenceTone}>
            <Flame size={12} aria-hidden="true" />
            Recorrência {modulo.recorrencia} no ENEM
          </Badge>
          <span className="modulo-id-tag">ID: {modulo.id}</span>
        </div>

        <h1 id={`title-${modulo.id}`} className="modulo-title">
          {modulo.tituloTematico}
        </h1>

        <div className="modulo-inep-meta">
          <div className="inep-meta-item">
            <span className="inep-meta-label">Matriz Inep:</span>
            <span className="inep-meta-val">{modulo.competencia}</span>
          </div>
          <div className="inep-meta-item">
            <span className="inep-meta-label">Habilidade:</span>
            <span className="inep-meta-val">{modulo.habilidade}</span>
          </div>
        </div>

        {/* Barra de Ações Rápidas */}
        <div className="modulo-actions-bar">
          <NotebookLMButton modulo={modulo} />
          
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => setShowJsonRaw(!showJsonRaw)}
            title="Ver schema rico de engenharia pedagógica em JSON"
          >
            <Code2 size={16} />
            <span>{showJsonRaw ? 'Ocultar JSON API' : 'Inspecionar Schema JSON'}</span>
          </button>
        </div>

        {showJsonRaw ? (
          <div className="modulo-json-inspector">
            <pre>
              <code>{JSON.stringify(modulo, null, 2)}</code>
            </pre>
          </div>
        ) : null}
      </header>

      {/* 1. Fundamentação Teórica (LaTeX + KaTeX) */}
      <section className="modulo-section" aria-labelledby="sec-fundamentacao">
        <div className="section-title-row">
          <span className="section-icon">
            <BookOpen size={18} />
          </span>
          <h2 id="sec-fundamentacao" className="modulo-section-heading">
            Fundamentação Teórica e Modelagem
          </h2>
        </div>

        <div className="modulo-theory-content">
          <MathMarkdown content={modulo.fundamentacaoTeorica} />
        </div>
      </section>

      {/* 2. Elemento Visual Original e Alt-Text Analítico */}
      {modulo.elementoVisualOriginal ? (
        <section className="modulo-section" aria-labelledby="sec-visual">
          <div className="section-title-row">
            <span className="section-icon">
              <Layers size={18} />
            </span>
            <h2 id="sec-visual" className="modulo-section-heading">
              Elemento Visual Original Homologado
            </h2>
          </div>

          <SmartMediaViewer
            url={modulo.elementoVisualOriginal.urlImagem}
            altText={modulo.elementoVisualOriginal.altTextAnalitico}
          />
        </section>
      ) : null}

      {/* 3. Esquema Conceitual e Roteiro Estrutural */}
      {modulo.esquemaConceitual ? (
        <section className="modulo-section" aria-labelledby="sec-esquema">
          <EsquemaConceitualCard esquema={modulo.esquemaConceitual} />
        </section>
      ) : null}

      {/* 4. Radar Anti-Pegadinhas */}
      <section className="modulo-section" aria-labelledby="sec-pegadinhas">
        <RadarPegadinhaCard
          title={`Radar de Armadilhas: ${modulo.tituloTematico}`}
          wrongThinking={modulo.distratoresComuns}
          correctThinking={modulo.comoCostumaCair}
        />
      </section>

      {/* 5. Item de Fixação e Simulado Interativo */}
      {modulo.itemFixacao ? (
        <section className="modulo-section" aria-labelledby="sec-fixacao">
          <div className="section-title-row">
            <span className="section-icon">
              <Sparkles size={18} />
            </span>
            <h2 id="sec-fixacao" className="modulo-section-heading">
              Item de Fixação e Simulado Interativo
            </h2>
          </div>

          <ItemFixacaoInteractive
            item={modulo.itemFixacao}
            fontesCanonicas={modulo.fontesCanonicas}
          />
        </section>
      ) : null}
    </article>
  );
}
