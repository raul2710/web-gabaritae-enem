'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  Sparkles,
  XCircle,
} from 'lucide-react';

import type { EnemTrap } from '@/domain/types';

interface RadarPegadinhaProps {
  title?: string;
  wrongThinking?: string;
  correctThinking?: string;
  quickQuiz?: {
    question: string;
    options: string[];
    correctIndex: number;
  };
  enemTrap?: EnemTrap;
  className?: string;
}

export function RadarPegadinhaCard({
  title = 'Radar Anti-Pegadinhas do ENEM',
  wrongThinking = '',
  correctThinking = '',
  quickQuiz,
  enemTrap,
  className = '',
}: RadarPegadinhaProps) {
  // Unifica se vier do enemTrap
  const effectiveTitle = enemTrap?.title || title;
  const effectiveWrong = enemTrap?.wrongThinking || wrongThinking;
  const effectiveCorrect = enemTrap?.correctThinking || correctThinking;

  const quizQuestion = enemTrap?.quickQuestion || quickQuiz?.question;
  const quizOptions = enemTrap?.options || quickQuiz?.options;
  const quizCorrectIndex = enemTrap?.correctOptionIndex ?? quickQuiz?.correctIndex;

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelectOption = (index: number) => {
    if (answered) return;
    setSelectedOption(index);
    setAnswered(true);
  };

  const resetQuiz = () => {
    setSelectedOption(null);
    setAnswered(false);
  };

  return (
    <aside className={`radar-pegadinha-card ${className}`} aria-label={effectiveTitle}>
      <header className="radar-header">
        <span className="radar-icon-badge">
          <ShieldAlert size={20} aria-hidden="true" />
        </span>
        <div>
          <span className="radar-eyebrow">Atenção TRI</span>
          <h3 className="radar-title">{effectiveTitle}</h3>
        </div>
      </header>

      {/* Grid Comparativo: Erro vs Acerto */}
      <div className="radar-grid">
        <div className="radar-col radar-col--wrong">
          <div className="radar-col-header">
            <XCircle size={18} className="radar-col-icon" aria-hidden="true" />
            <span className="radar-col-label">Pensamento Errado (Distrator Comum)</span>
          </div>
          <p className="radar-col-text">{effectiveWrong}</p>
        </div>

        <div className="radar-col radar-col--correct">
          <div className="radar-col-header">
            <CheckCircle2 size={18} className="radar-col-icon" aria-hidden="true" />
            <span className="radar-col-label">Pensamento Correto (Como o ENEM cobra)</span>
          </div>
          <p className="radar-col-text">{effectiveCorrect}</p>
        </div>
      </div>

      {/* Mini-Quiz Rápido */}
      {quizQuestion && quizOptions && quizOptions.length > 0 && quizCorrectIndex !== undefined ? (
        <div className="radar-quiz">
          <div className="radar-quiz-header">
            <HelpCircle size={16} aria-hidden="true" />
            <span className="radar-quiz-title">Teste Rápido: Você cairia nessa pegadinha?</span>
          </div>

          <p className="radar-quiz-question">{quizQuestion}</p>

          <div className="radar-quiz-options" role="radiogroup">
            {quizOptions.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === quizCorrectIndex;
              let btnClass = 'radar-quiz-btn';

              if (answered) {
                if (isCorrect) {
                  btnClass += ' radar-quiz-btn--correct';
                } else if (isSelected) {
                  btnClass += ' radar-quiz-btn--wrong';
                }
              } else if (isSelected) {
                btnClass += ' radar-quiz-btn--selected';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  className={btnClass}
                  onClick={() => handleSelectOption(idx)}
                  disabled={answered}
                  role="radio"
                  aria-checked={isSelected}
                >
                  <span className="radar-quiz-bullet">{String.fromCharCode(65 + idx)}</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {answered ? (
            <div className="radar-quiz-feedback">
              {selectedOption === quizCorrectIndex ? (
                <div className="radar-feedback radar-feedback--success">
                  <CheckCircle2 size={16} />
                  <span>
                    <strong>Excelente!</strong> Você identificou o raciocínio correto e blindou sua pontuação na TRI.
                  </span>
                </div>
              ) : (
                <div className="radar-feedback radar-feedback--alert">
                  <AlertTriangle size={16} />
                  <span>
                    <strong>Cuidado!</strong> Essa é a pegadinha exata que o distrator induz. Releia o Pensamento Correto acima.
                  </span>
                </div>
              )}

              <button type="button" className="radar-retry-btn" onClick={resetQuiz}>
                Refazer teste rápido
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
