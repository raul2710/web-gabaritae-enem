'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Clock,
  Compass,
  Download,
  FileDown,
  Filter,
  Flame,
  Layers,
  Sparkles,
  UploadCloud,
} from 'lucide-react';

import { AdminCuradoriaModal } from '@/components/admin/AdminCuradoriaModal';
import { OfflinePackManager } from '@/components/offline/OfflinePackManager';
import { Badge } from '@/components/ui/Badge';
import { MathMarkdown } from '@/components/ui/MathMarkdown';
import { SmartMediaViewer } from '@/components/ui/SmartMediaViewer';
import type { DisciplineMeta } from '@/domain/constants';
import type { ModuloDidatico, TheoryModule } from '@/domain/types';
import { ModuloDidaticoDetail } from './ModuloDidaticoDetail';
import { NotebookLMButton } from './NotebookLMButton';
import { RadarPegadinhaCard } from './RadarPegadinhaCard';

interface EstudarAreaClientProps {
  area: DisciplineMeta;
  initialModulos: ModuloDidatico[];
  initialApostilas: TheoryModule[];
}

export function EstudarAreaClient({
  area,
  initialModulos,
  initialApostilas,
}: EstudarAreaClientProps) {
  const [activeTab, setActiveTab] = useState<'modulos' | 'apostilas'>('modulos');
  const [recorrenciaFilter, setRecorrenciaFilter] = useState<string>('Todas');
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [modulosList, setModulosList] = useState<ModuloDidatico[]>(initialModulos);

  const filteredModulos = modulosList.filter((m) => {
    if (recorrenciaFilter === 'Todas') return true;
    return m.recorrencia.toLowerCase() === recorrenciaFilter.toLowerCase();
  });

  return (
    <div className="estudar-area-content">
      {/* Gerenciador de Pacote Offline */}
      <OfflinePackManager discipline={area.id} className="area-offline-box" />

      {/* Barra de Controles e Ações da Área */}
      <div className="area-controls-bar">
        {/* Alternador de Abas */}
        <div className="area-tab-group" role="tablist">
          <button
            type="button"
            className={`area-tab-btn ${activeTab === 'modulos' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('modulos')}
            role="tab"
            aria-selected={activeTab === 'modulos'}
          >
            <Sparkles size={16} />
            <span>Módulos Curados Inep ({modulosList.length})</span>
          </button>
          <button
            type="button"
            className={`area-tab-btn ${activeTab === 'apostilas' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('apostilas')}
            role="tab"
            aria-selected={activeTab === 'apostilas'}
          >
            <BookOpen size={16} />
            <span>Apostilas Temáticas ({initialApostilas.length})</span>
          </button>
        </div>

        {/* Ações de Exportação e Curadoria */}
        <div className="area-action-buttons">
          <NotebookLMButton
            area={area.name}
            variant="area"
            className="btn-sm"
          />

          <button
            type="button"
            className="btn btn--secondary btn-sm"
            onClick={() => setAdminModalOpen(true)}
            title="Importar novo módulo didático via Markdown ou JSON com validação Whitelist"
          >
            <UploadCloud size={15} />
            <span>Curadoria Admin</span>
          </button>
        </div>
      </div>

      {/* Aba 1: Módulos Didáticos Curados (Inep + NotebookLM) */}
      {activeTab === 'modulos' ? (
        <section className="modulos-section" aria-label="Módulos Didáticos Curados">
          {/* Filtro por Recorrência */}
          <div className="recorrencia-filter-row">
            <span className="filter-label">
              <Filter size={14} />
              Filtrar por Recorrência TRI:
            </span>
            {['Todas', 'Alta', 'Média', 'Baixa'].map((rec) => (
              <button
                key={rec}
                type="button"
                className={`filter-pill ${recorrenciaFilter === rec ? 'is-active' : ''}`}
                onClick={() => setRecorrenciaFilter(rec)}
              >
                {rec}
              </button>
            ))}
          </div>

          {filteredModulos.length === 0 ? (
            <div className="empty-state-card">
              <p>Nenhum módulo encontrado para este filtro.</p>
            </div>
          ) : (
            <div className="modulos-vertical-list">
              {filteredModulos.map((modulo) => (
                <ModuloDidaticoDetail key={modulo.id} modulo={modulo} />
              ))}
            </div>
          )}
        </section>
      ) : (
        /* Aba 2: Apostilas Temáticas com Radar Anti-Pegadinhas e KaTeX */
        <section className="theory-list" aria-label="Apostilas Temáticas">
          {initialApostilas.map((mod) => (
            <article key={mod.id} className="theory-card">
              <header className="theory-card__header">
                <div className="row">
                  <Badge tone="primary">{mod.subject}</Badge>
                  <Badge tone="warning">
                    <Sparkles size={13} aria-hidden="true" />
                    {mod.incidence}
                  </Badge>
                  <span className="theory-card__reading">
                    <Clock size={14} aria-hidden="true" />
                    {mod.readingTime}
                  </span>
                </div>

                <h2 className="theory-card__title">{mod.title}</h2>
                <p className="theory-card__summary">{mod.summary}</p>
              </header>

              {mod.imageUrl ? (
                <SmartMediaViewer
                  url={mod.imageUrl}
                  caption={mod.imageCaption}
                  className="theory-card__figure"
                />
              ) : null}

              <div className="theory-card__sections">
                {mod.sections.map((section) => (
                  <div key={section.heading} className="theory-section">
                    <h3 className="theory-section__heading">{section.heading}</h3>
                    <div className="theory-section__body">
                      <MathMarkdown content={section.body} />
                    </div>
                  </div>
                ))}
              </div>

              {mod.keyFormulas && mod.keyFormulas.length > 0 ? (
                <div className="theory-formulas">
                  <h3 className="theory-formulas__title">Fórmulas e conceitos-chave (LaTeX)</h3>
                  <div className="theory-formulas__grid">
                    {mod.keyFormulas.map((formula, idx) => (
                      <div key={idx} className="theory-formula-box">
                        <MathMarkdown content={`$${formula.replace(/^\$|\$$/g, '')}$`} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {mod.enemTrap ? (
                <RadarPegadinhaCard enemTrap={mod.enemTrap} />
              ) : null}
            </article>
          ))}
        </section>
      )}

      {/* Modal de Curadoria Admin */}
      <AdminCuradoriaModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onSuccess={() => {
          // Atualiza lista se algo foi importado com sucesso
          setAdminModalOpen(false);
        }}
      />
    </div>
  );
}
