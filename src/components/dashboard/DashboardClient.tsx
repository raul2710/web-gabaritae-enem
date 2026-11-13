'use client';

import { ArrowRight, CalendarCheck, Check, ClipboardList, Trophy, X } from 'lucide-react';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StudyGoalCard } from '@/components/dashboard/StudyGoalCard';
import { questions as catalogQuestions } from '@/data/catalog';
import { ENEM_DISCIPLINES } from '@/domain/constants';
import {
  computeStats,
  getLatestAttempts,
  getSubjectPerformance,
  getWeeklySeries,
} from '@/domain/stats';
import type { AnswerAttempt, SessionUser } from '@/domain/types';
import { useHydrated } from '@/hooks/useHydrated';
import { useAttemptsStore } from '@/stores/useAttemptsStore';

/** Meta padrão de questões por dia. */
const DAILY_GOAL = 15;

/** Referência estável para o store quando o usuário ainda não tem tentativas. */
const EMPTY_ATTEMPTS: AnswerAttempt[] = [];

const DISCIPLINE_META = new Map(ENEM_DISCIPLINES.map((item) => [item.id, item]));
const DISCIPLINE_NAMES = new Map(ENEM_DISCIPLINES.map((item) => [item.id, item.name]));
const QUESTIONS_BY_ID = new Map(catalogQuestions.map((question) => [question.id, question]));

const TODAY_FORMAT = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

const HISTORY_DATE_FORMAT = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? '';
}

function formatAttemptDate(timestamp: string): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '—';
  return HISTORY_DATE_FORMAT.format(date);
}

function goalTone(rate: number): 'default' | 'positive' | 'warning' {
  if (rate >= 100) return 'positive';
  if (rate >= 50) return 'default';
  return 'warning';
}

function subjectTone(total: number, rate: number): 'default' | 'positive' | 'warning' {
  if (total === 0) return 'default';
  if (rate >= 70) return 'positive';
  if (rate < 50) return 'warning';
  return 'default';
}

/** Placeholder estável enquanto o store persistido não hidrata no cliente. */
function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton" aria-hidden="true">
      <div className="kpi-grid">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="dashboard-skeleton__block dashboard-skeleton__block--kpi" />
        ))}
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-skeleton__block dashboard-skeleton__block--chart" />
        <div className="dashboard-skeleton__block dashboard-skeleton__block--chart" />
      </div>
      <div className="dashboard-skeleton__block dashboard-skeleton__block--list" />
    </div>
  );
}

interface DashboardClientProps {
  user: SessionUser;
}

/**
 * Painel do aluno: score consolidado, ritmo semanal, desempenho por área e
 * histórico recente — tudo derivado das tentativas persistidas no cliente.
 */
export function DashboardClient({ user }: DashboardClientProps) {
  const hydrated = useHydrated();
  // Referência estável (evita re-render em loop com `?? []` dentro do seletor).
  const storedAttempts = useAttemptsStore((state) => state.byUser[user.id]);
  const attempts = storedAttempts ?? EMPTY_ATTEMPTS;

  const latest = getLatestAttempts(attempts);
  const stats = computeStats(latest, DAILY_GOAL);
  const activity = computeStats(attempts, DAILY_GOAL);
  const weekly = getWeeklySeries(attempts);
  const performance = getSubjectPerformance(latest);

  const maxWeekly = Math.max(1, ...weekly.map((point) => point.count));
  const weeklySummary = weekly.map((point) => `${point.label}: ${point.count}`).join(', ');
  const recent = useMemo(() => attempts.slice(0, 5), [attempts]);

  return (
    <section className="section">
      <header className="dashboard-header">
        <div>
          <span className="section-header__eyebrow">Área do aluno</span>
          <h1 className="dashboard-header__title">Olá, {firstName(user.name)}!</h1>
          {hydrated ? <p className="dashboard-header__date">{TODAY_FORMAT.format(new Date())}</p> : null}
        </div>

        <div className="row">
          <Button href="/app/provas">
            <ClipboardList size={16} aria-hidden="true" />
            Fazer uma prova
          </Button>
          <Button href="/app/simulados" variant="secondary">
            <CalendarCheck size={16} aria-hidden="true" />
            Novo simulado
          </Button>
        </div>
      </header>

      {!hydrated ? (
        <DashboardSkeleton />
      ) : (
        <>
          <StudyGoalCard userId={user.id} />

          <div className="kpi-grid">
            <div className="kpi">
              <span className="kpi__value">{stats.accuracyRate}%</span>
              <span className="kpi__label">Aproveitamento</span>
            </div>
            <div className="kpi">
              <span className="kpi__value">{stats.uniqueQuestions}</span>
              <span className="kpi__label">Questões respondidas</span>
            </div>
            <div className="kpi">
              <span className="kpi__value">{stats.correct}</span>
              <span className="kpi__label">Acertos</span>
            </div>
            <div className="kpi">
              <span className="kpi__value">
                {activity.todayCount}/{activity.dailyGoal}
              </span>
              <span className="kpi__label">Meta diária</span>
              <ProgressBar
                label="Progresso da meta"
                value={activity.todayCount}
                max={activity.dailyGoal}
                valueText={`${activity.dailyGoalRate}%`}
                tone={goalTone(activity.dailyGoalRate)}
              />
            </div>
          </div>

          {attempts.length === 0 ? (
            <EmptyState
              icon={<Trophy size={32} />}
              title="Seu painel começa na primeira questão"
              description="Assim que você responder a primeira questão de uma prova, o aproveitamento, o ritmo semanal e o desempenho por área aparecem aqui."
              action={<Button href="/app/provas">Fazer primeira prova</Button>}
            />
          ) : (
            <>
              <div className="dashboard-grid">
                <Card>
                  <div className="section-header">
                    <div className="section-header__text">
                      <span className="section-header__eyebrow">Ritmo</span>
                      <h2>Últimos 7 dias</h2>
                      <p className="section-header__description">
                        Questões únicas respondidas por dia.
                      </p>
                    </div>
                  </div>

                  <div className="chart-bars">
                    <p className="sr-only">Resumo do ritmo semanal: {weeklySummary}.</p>
                    {weekly.map((point) => (
                      <div
                        key={point.date}
                        className={point.isToday ? 'chart-bar chart-bar--today' : 'chart-bar'}
                        role="img"
                        aria-label={`${point.label}: ${point.count} ${
                          point.count === 1 ? 'questão' : 'questões'
                        }`}
                      >
                        <span className="chart-bar__value">{point.count}</span>
                        <span
                          className="chart-bar__fill"
                          style={{
                            height: `${Math.max(6, Math.round((point.count / maxWeekly) * 112))}px`,
                          }}
                        />
                        <span className="chart-bar__label">{point.label}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <div className="section-header">
                    <div className="section-header__text">
                      <span className="section-header__eyebrow">Desempenho</span>
                      <h2>Por área do conhecimento</h2>
                      <p className="section-header__description">
                        Taxa de acerto na última resposta de cada questão.
                      </p>
                    </div>
                  </div>

                  <div className="stack">
                    {performance.map((item) => {
                      const meta = DISCIPLINE_META.get(item.discipline);
                      if (!meta) return null;

                      return (
                        <div key={item.discipline} className="subject-row">
                          <ProgressBar
                            label={meta.name}
                            value={item.accuracyRate}
                            max={100}
                            valueText={`${item.accuracyRate}%`}
                            tone={subjectTone(item.total, item.accuracyRate)}
                          />
                          <p className="subject-row__total">
                            {item.total === 0
                              ? 'Sem tentativas'
                              : `${item.correct} de ${item.total} acertos`}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>

              <SectionHeader
                eyebrow="Histórico"
                title="Últimas tentativas"
                description={`${activity.totalAttempts} ${
                  activity.totalAttempts === 1 ? 'resposta registrada' : 'respostas registradas'
                } no total.`}
                action={
                  <Button href="/app/provas" variant="ghost" size="sm">
                    Ver todas as provas
                    <ArrowRight size={14} aria-hidden="true" />
                  </Button>
                }
              />

              <ul className="history-list">
                {recent.map((attempt) => {
                  const question = QUESTIONS_BY_ID.get(attempt.questionId);
                  const isCorrect = attempt.isCorrect;
                  const disciplineName =
                    DISCIPLINE_NAMES.get(attempt.discipline) ?? attempt.discipline;

                  return (
                    <li
                      key={`${attempt.questionId}-${attempt.timestamp}`}
                      className="history-item"
                    >
                      <span
                        className={[
                          'history-item__status',
                          isCorrect
                            ? 'history-item__status--correct'
                            : 'history-item__status--wrong',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        aria-hidden="true"
                      >
                        {isCorrect ? <Check size={16} /> : <X size={16} />}
                      </span>

                      <div className="history-item__body">
                        <p className="history-item__title">
                          {question?.title ?? 'Questão fora do catálogo'}
                        </p>
                        <p className="history-item__meta">
                          {disciplineName} · {formatAttemptDate(attempt.timestamp)}
                        </p>
                      </div>

                      <Badge tone={isCorrect ? 'positive' : 'negative'}>
                        {isCorrect ? 'Acerto' : 'Erro'}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </>
      )}
    </section>
  );
}
