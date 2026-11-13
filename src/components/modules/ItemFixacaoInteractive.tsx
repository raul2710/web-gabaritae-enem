'use client';

import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

import { MathMarkdown } from '@/components/ui/MathMarkdown';
import type { AlternativeLetter, ItemFixacao } from '@/domain/types';

interface ItemFixacaoInteractiveProps {
  item: ItemFixacao;
  fontesCanonicas?: string[];
  className?: string;
}

const LETTERS: AlternativeLetter[] = ['A', 'B', 'C', 'D', 'E'];

export function ItemFixacaoInteractive({
  item,
  fontesCanonicas = [],
  className = '',
}: ItemFixacaoInteractiveProps) {
  const [selected, setSelected] = useState<AlternativeLetter | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const isCorrect = selected === item.gabaritoOficial;

  const handleSelect = (letter: AlternativeLetter) => {
    if (confirmed) return;
    setSelected(letter);
  };

  const handleConfirm = () => {
    if (!selected) return;
    setConfirmed(true);
    setShowExplanation(true);
  };

  const handleReset = () => {
    setSelected(null);
    setConfirmed(false);
    setShowExplanation(false);
  };

  return (
    <div className={`item-fixacao-card ${className}`}>
      <header className="item-fixacao-header">
        <div className="item-fixacao-badge-row">
          <span className="badge badge--primary">
            <Award size={13} aria-hidden="true" />
            Item de Fixação Oficial
          </span>
          <span className="badge">ENEM {item.ano}</span>
          <span className="badge">Caderno {item.corCaderno}</span>
          <span className="badge">Questão {item.numeroQuestao}</span>
        </div>

        <p className="item-fixacao-referencia">{item.referencia}</p>
      </header>

      {/* Enunciado com suporte a LaTeX */}
      <div className="item-fixacao-statement">
        <MathMarkdown content={item.enunciado} />
      </div>

      {/* Alternativas A-E */}
      <ol className="item-fixacao-alternatives" aria-label="Alternativas">
        {item.alternativas.map((altText, idx) => {
          const letter = LETTERS[idx];
          const isSelected = selected === letter;
          const isGabarito = letter === item.gabaritoOficial;

          let btnClass = 'item-alt-btn';
          if (confirmed) {
            if (isGabarito) {
              btnClass += ' item-alt-btn--correct';
            } else if (isSelected) {
              btnClass += ' item-alt-btn--wrong';
            }
          } else if (isSelected) {
            btnClass += ' item-alt-btn--selected';
          }

          return (
            <li key={letter} className="item-alt-li">
              <button
                type="button"
                className={btnClass}
                onClick={() => handleSelect(letter)}
                disabled={confirmed}
                aria-pressed={isSelected}
                aria-label={`Alternativa ${letter}: ${altText}`}
              >
                <span className="item-alt-letter" aria-hidden="true">
                  {letter}
                </span>
                <span className="item-alt-text">
                  <MathMarkdown content={altText} />
                </span>
                {confirmed && isGabarito ? (
                  <CheckCircle2 size={18} className="item-alt-status-icon text-positive" />
                ) : null}
                {confirmed && isSelected && !isGabarito ? (
                  <XCircle size={18} className="item-alt-status-icon text-negative" />
                ) : null}
              </button>
            </li>
          );
        })}
      </ol>

      {/* Ações e Feedback */}
      <div className="item-fixacao-actions">
        {!confirmed ? (
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleConfirm}
            disabled={!selected}
          >
            Confirmar e Validar Resposta
          </button>
        ) : (
          <div className="item-fixacao-feedback-summary">
            <div className={`item-result-pill ${isCorrect ? 'is-correct' : 'is-wrong'}`}>
              {isCorrect ? (
                <>
                  <CheckCircle2 size={18} />
                  <span>Você acertou! Gabarito oficial: <strong>{item.gabaritoOficial}</strong></span>
                </>
              ) : (
                <>
                  <XCircle size={18} />
                  <span>Você errou. Gabarito oficial: <strong>{item.gabaritoOficial}</strong></span>
                </>
              )}
            </div>

            <div className="row">
              <button
                type="button"
                className="btn btn--secondary btn-sm"
                onClick={() => setShowExplanation(!showExplanation)}
              >
                <Lightbulb size={14} />
                {showExplanation ? 'Ocultar Resolução' : 'Ver Resolução Passo a Passo'}
                {showExplanation ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              <button type="button" className="btn btn--ghost btn-sm" onClick={handleReset}>
                Refazer Item
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Acordeão de Resolução Comentada */}
      {confirmed && showExplanation ? (
        <div className="item-resolucao-accordion" role="region" aria-label="Resolução Comentada">
          <div className="item-resolucao-header">
            <Lightbulb size={18} className="text-primary" />
            <h4>Resolução Oficial Comentada</h4>
          </div>

          <div className="item-resolucao-content">
            <MathMarkdown content={item.resolucaoComentada} />
          </div>

          {/* Fontes Canônicas Homologadas */}
          {fontesCanonicas.length > 0 ? (
            <div className="item-fontes-homologadas">
              <div className="fontes-title">
                <ShieldCheck size={14} />
                <span>Fontes Canônicas Homologadas (Whitelist Inep)</span>
              </div>
              <ul className="fontes-list">
                {fontesCanonicas.map((url, idx) => (
                  <li key={idx}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="fonte-link">
                      <ExternalLink size={12} />
                      <span>{url}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
