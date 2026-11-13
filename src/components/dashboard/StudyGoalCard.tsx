'use client';

import { CheckCircle2, GraduationCap, Pencil, Target } from 'lucide-react';
import { useState, type FormEvent } from 'react';

import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { estimateEnemScore, getLatestAttempts, computeStats } from '@/domain/stats';
import type { AnswerAttempt } from '@/domain/types';
import { useHydrated } from '@/hooks/useHydrated';
import { useAttemptsStore } from '@/stores/useAttemptsStore';
import { useStudyGoalStore } from '@/stores/useStudyGoalStore';

interface StudyGoalCardProps {
  userId: string;
}

const EMPTY_ATTEMPTS: AnswerAttempt[] = [];

const POPULAR_PRESETS = [
  { focusCourse: 'Medicina', targetUniversity: 'USP / UFMG', targetScore: 810 },
  { focusCourse: 'Engenharia / Computação', targetUniversity: 'UNICAMP / UFRJ', targetScore: 760 },
  { focusCourse: 'Direito', targetUniversity: 'USP / UnB', targetScore: 750 },
  { focusCourse: 'Psicologia', targetUniversity: 'UFMG / UFRGS', targetScore: 730 },
];

export function StudyGoalCard({ userId }: StudyGoalCardProps) {
  const hydrated = useHydrated();
  const savedGoal = useStudyGoalStore((state) => state.byUser[userId]);
  const setGoal = useStudyGoalStore((state) => state.setGoal);
  const storedAttempts = useAttemptsStore((state) => state.byUser[userId]);

  const [editing, setEditing] = useState(false);
  const [focusCourse, setFocusCourse] = useState('');
  const [targetUniversity, setTargetUniversity] = useState('');
  const [targetScore, setTargetScore] = useState('750');
  const [error, setError] = useState<string | null>(null);
  const [savedToast, setSavedToast] = useState(false);

  if (!hydrated) {
    return null;
  }

  const attempts = storedAttempts ?? EMPTY_ATTEMPTS;
  const latest = getLatestAttempts(attempts);
  const stats = computeStats(latest, 15);
  const currentEstimatedScore = estimateEnemScore(stats.accuracyRate, stats.uniqueQuestions);

  const isFormVisible = editing || !savedGoal;

  function openEditor() {
    setFocusCourse(savedGoal?.focusCourse ?? '');
    setTargetUniversity(savedGoal?.targetUniversity ?? '');
    setTargetScore(String(savedGoal?.targetScore ?? 750));
    setError(null);
    setEditing(true);
  }

  function applyPreset(preset: {
    focusCourse: string;
    targetUniversity: string;
    targetScore: number;
  }) {
    setFocusCourse(preset.focusCourse);
    setTargetUniversity(preset.targetUniversity);
    setTargetScore(String(preset.targetScore));
    setError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const course = focusCourse.trim();
    const university = targetUniversity.trim();
    const scoreNum = Number(targetScore);

    if (!course) {
      setError('Informe qual curso ou foco você quer alcançar.');
      return;
    }
    if (!university) {
      setError('Informe a universidade desejada (ex.: USP, UFMG, UNICAMP).');
      return;
    }
    if (!Number.isFinite(scoreNum) || scoreNum < 400 || scoreNum > 1000) {
      setError('Informe uma nota alvo no ENEM entre 400 e 1000 pontos.');
      return;
    }

    setGoal(userId, {
      focusCourse: course,
      targetUniversity: university,
      targetScore: Math.round(scoreNum),
    });

    setEditing(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  }

  if (isFormVisible) {
    return (
      <section className="goal-card" aria-labelledby="goal-form-title">
        <div className="goal-card__top">
          <div>
            <span className="section-header__eyebrow">Seu objetivo no ENEM</span>
            <h2 id="goal-form-title" className="goal-card__title">
              Qual curso, universidade e nota você quer conquistar?
            </h2>
            <p className="meta" style={{ marginTop: 'var(--space-xs)' }}>
              Defina seu foco e a nota de corte que você precisa no SISU/ENEM para acompanhar o
              quanto falta para chegar lá.
            </p>
          </div>
        </div>

        <div className="goal-presets" aria-label="Sugestões rápidas de foco">
          <span className="goal-presets__label">Sugestões rápidas:</span>
          <div className="goal-presets__list">
            {POPULAR_PRESETS.map((preset) => (
              <button
                key={preset.focusCourse}
                type="button"
                className="chip"
                onClick={() => applyPreset(preset)}
              >
                {preset.focusCourse} · {preset.targetScore} pts
              </button>
            ))}
          </div>
        </div>

        <form className="goal-form" onSubmit={handleSubmit} noValidate>
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="goal-form__grid">
            <div className="field">
              <label className="field-label" htmlFor="goal-course">
                Seu foco / Curso desejado
              </label>
              <input
                id="goal-course"
                className="input"
                type="text"
                value={focusCourse}
                onChange={(event) => setFocusCourse(event.target.value)}
                placeholder="Ex.: Medicina, Direito, Ciência da Computação"
                required
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="goal-university">
                Universidade que você quer
              </label>
              <input
                id="goal-university"
                className="input"
                type="text"
                value={targetUniversity}
                onChange={(event) => setTargetUniversity(event.target.value)}
                placeholder="Ex.: USP, UFMG, UFRJ, UNICAMP"
                required
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="goal-score">
                Score necessário no ENEM (400–1000)
              </label>
              <input
                id="goal-score"
                className="input"
                type="number"
                min={400}
                max={1000}
                step={5}
                inputMode="numeric"
                value={targetScore}
                onChange={(event) => setTargetScore(event.target.value)}
                placeholder="Ex.: 780"
                required
              />
            </div>
          </div>

          <div className="goal-form__actions">
            <button type="submit" className="btn btn--primary btn--sm">
              <Target size={16} aria-hidden="true" />
              Salvar meu objetivo
            </button>
            {savedGoal ? (
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={() => {
                  setError(null);
                  setEditing(false);
                }}
              >
                Cancelar
              </button>
            ) : null}
          </div>
        </form>
      </section>
    );
  }

  const remainingPoints = Math.max(0, savedGoal.targetScore - currentEstimatedScore);
  const progressValue =
    currentEstimatedScore > 0
      ? Math.min(100, Math.round((currentEstimatedScore / savedGoal.targetScore) * 100))
      : 0;
  const reachedGoal = currentEstimatedScore >= savedGoal.targetScore && stats.uniqueQuestions > 0;

  return (
    <section className="goal-card" aria-labelledby="goal-summary-title">
      <div className="goal-card__top">
        <div className="goal-card__identity">
          <span className="goal-card__badge-icon" aria-hidden="true">
            <GraduationCap size={22} />
          </span>
          <div>
            <span className="section-header__eyebrow">Meta de aprovação no ENEM</span>
            <h2 id="goal-summary-title" className="goal-card__title">
              {savedGoal.focusCourse} · {savedGoal.targetUniversity}
            </h2>
          </div>
        </div>

        <div className="row">
          {savedToast ? (
            <Badge tone="positive">
              <CheckCircle2 size={13} aria-hidden="true" />
              Meta atualizada
            </Badge>
          ) : null}
          <button type="button" className="btn btn--secondary btn--sm" onClick={openEditor}>
            <Pencil size={14} aria-hidden="true" />
            Editar foco
          </button>
        </div>
      </div>

      <div className="goal-card__metrics">
        <div className="goal-card__stat">
          <span className="goal-card__stat-label">Score que você precisa</span>
          <span className="goal-card__stat-value tabular">{savedGoal.targetScore} pts</span>
        </div>

        <div className="goal-card__stat">
          <span className="goal-card__stat-label">Seu score estimado atual</span>
          <span className="goal-card__stat-value tabular">
            {stats.uniqueQuestions > 0 ? `${currentEstimatedScore} pts` : '—'}
          </span>
        </div>

        <div className="goal-card__stat">
          <span className="goal-card__stat-label">Distância para a aprovação</span>
          <span className="goal-card__stat-value tabular">
            {stats.uniqueQuestions === 0
              ? `Meta: ${savedGoal.targetScore} pts`
              : reachedGoal
                ? 'Meta atingida!'
                : `Faltam ${remainingPoints} pts`}
          </span>
        </div>
      </div>

      <ProgressBar
        label={`Progresso rumo a ${savedGoal.focusCourse} na ${savedGoal.targetUniversity}`}
        value={currentEstimatedScore}
        max={savedGoal.targetScore}
        valueText={
          stats.uniqueQuestions > 0
            ? `${currentEstimatedScore} / ${savedGoal.targetScore} pts (${progressValue}%)`
            : `0 / ${savedGoal.targetScore} pts (responda questões para calcular)`
        }
        tone={reachedGoal ? 'positive' : progressValue >= 80 ? 'default' : 'warning'}
      />
    </section>
  );
}
