'use client';

import React, { useState } from 'react';
import {
  Check,
  Copy,
  GitFork,
  HelpCircle,
  Layers,
  Sparkles,
  Target,
} from 'lucide-react';

import type { EsquemaConceitual } from '@/domain/types';

interface EsquemaConceitualCardProps {
  esquema: EsquemaConceitual;
  className?: string;
}

export function EsquemaConceitualCard({
  esquema,
  className = '',
}: EsquemaConceitualCardProps) {
  const [selectedPromptLang, setSelectedPromptLang] = useState<'PT' | 'EN'>('PT');
  const [copied, setCopied] = useState(false);

  const activePrompt =
    selectedPromptLang === 'PT' ? esquema.promptPortugues : esquema.promptIngles;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activePrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <section className={`esquema-conceitual-wrapper ${className}`} aria-labelledby="esquema-title">
      <header className="esquema-header">
        <div className="esquema-title-group">
          <span className="esquema-icon-badge">
            <Sparkles size={18} aria-hidden="true" />
          </span>
          <div>
            <h3 id="esquema-title" className="esquema-title">
              Esquema Conceitual e Roteiro Estrutural
            </h3>
            <p className="esquema-subtitle">
              Síntese visual cognitiva projetada para fixação rápida da competência
            </p>
          </div>
        </div>

        {/* Seletor de Prompt Técnico */}
        <div className="esquema-prompt-controls">
          <div className="prompt-lang-toggle" role="group" aria-label="Idioma do prompt gerador">
            <button
              type="button"
              className={`prompt-lang-btn ${selectedPromptLang === 'PT' ? 'is-active' : ''}`}
              onClick={() => setSelectedPromptLang('PT')}
            >
              PT
            </button>
            <button
              type="button"
              className={`prompt-lang-btn ${selectedPromptLang === 'EN' ? 'is-active' : ''}`}
              onClick={() => setSelectedPromptLang('EN')}
            >
              EN
            </button>
          </div>

          <button
            type="button"
            className="btn btn--secondary btn-sm copy-prompt-btn"
            onClick={handleCopy}
            title="Copiar prompt gerador para IA (Midjourney/DALL-E/Imagen)"
          >
            {copied ? (
              <>
                <Check size={14} aria-hidden="true" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy size={14} aria-hidden="true" />
                <span>Copiar Prompt {selectedPromptLang}</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Roteiro Estrutural em Cards Conectados */}
      <div className="esquema-pipeline">
        {/* 1. Objetivo Pedagógico */}
        <article className="esquema-node esquema-node--target">
          <div className="esquema-node-header">
            <Target size={16} aria-hidden="true" />
            <span>Objetivo Pedagógico</span>
          </div>
          <p className="esquema-node-body">{esquema.objetivoPedagogico}</p>
        </article>

        <div className="esquema-connector" aria-hidden="true">
          <div className="esquema-connector-line" />
          <div className="esquema-connector-dot" />
        </div>

        {/* 2. Elemento Central */}
        <article className="esquema-node esquema-node--center">
          <div className="esquema-node-header">
            <Layers size={16} aria-hidden="true" />
            <span>Elemento Central</span>
          </div>
          <p className="esquema-node-body">
            <strong>{esquema.roteiroEstrutural.elementoCentral}</strong>
          </p>
        </article>

        <div className="esquema-connector" aria-hidden="true">
          <div className="esquema-connector-line" />
          <div className="esquema-connector-dot" />
        </div>

        {/* 3. Fluxos e Relações */}
        <article className="esquema-node esquema-node--flows">
          <div className="esquema-node-header">
            <GitFork size={16} aria-hidden="true" />
            <span>Fluxos e Relações</span>
          </div>
          <p className="esquema-node-body">{esquema.roteiroEstrutural.fluxosERelacoes}</p>
        </article>

        <div className="esquema-connector" aria-hidden="true">
          <div className="esquema-connector-line" />
          <div className="esquema-connector-dot" />
        </div>

        {/* 4. Legenda Explicativa */}
        <article className="esquema-node esquema-node--legend">
          <div className="esquema-node-header">
            <HelpCircle size={16} aria-hidden="true" />
            <span>Legenda Explicativa</span>
          </div>
          <p className="esquema-node-body">{esquema.roteiroEstrutural.legendaExplicativa}</p>
        </article>
      </div>

      {/* Caixa Expansível com Prompt Técnico de Geração de Imagem */}
      <details className="esquema-prompt-details">
        <summary className="esquema-prompt-summary">
          <span>Ver Prompt de Imagem ({selectedPromptLang})</span>
        </summary>
        <div className="esquema-prompt-code-wrap">
          <pre className="esquema-prompt-code">
            <code>{activePrompt}</code>
          </pre>
        </div>
      </details>
    </section>
  );
}
