'use client';

import {
  AlarmClock,
  Calendar,
  CheckCircle2,
  Flame,
  NotebookPen,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/Badge';
import { EnemDatePicker } from '@/components/ui/EnemDatePicker';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ENEM_COUNTDOWN_WINDOW_DAYS } from '@/domain/constants';
import { useHydrated } from '@/hooks/useHydrated';
import { useStudyGoalStore } from '@/stores/useStudyGoalStore';

interface EnemCountdownBannerProps {
  userId: string;
  /** Quando true, exibe a configuração de data mesmo fora da janela de 1 mês (ex.: no Perfil). */
  allowConfigOutsideWindow?: boolean;
}

interface CountdownParts {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isWithinOneMonth: boolean;
  isExamToday: boolean;
}

/**
 * Calcula os domingos de aplicação do ENEM de um determinado ano às 13:00
 * (1º e 2º domingos de novembro; ou 2º e 3º domingos quando 1º/nov cai próximo ao feriado).
 */
function getEnemExamSundays(year: number): Date[] {
  const novFirst = new Date(year, 10, 1, 13, 0, 0, 0);
  const dayOfWeek = novFirst.getDay(); // 0 = Domingo
  const offset = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const firstSunday = new Date(year, 10, 1 + offset, 13, 0, 0, 0);
  const secondSunday = new Date(year, 10, 1 + offset + 7, 13, 0, 0, 0);
  const thirdSunday = new Date(year, 10, 1 + offset + 14, 13, 0, 0, 0);
  return [firstSunday, secondSunday, thirdSunday];
}

/**
 * Retorna a próxima data oficial do ENEM (ou a data personalizada pelo aluno).
 */
export function resolveTargetEnemDate(customDateStr?: string, now = new Date()): Date {
  if (customDateStr && /^\d{4}-\d{2}-\d{2}$/.test(customDateStr)) {
    const [y, m, d] = customDateStr.split('-').map(Number);
    if (y && m && d) {
      return new Date(y, m - 1, d, 13, 0, 0, 0);
    }
  }

  const currentYear = now.getFullYear();
  const cutoff = now.getTime() - 12 * 60 * 60 * 1000;
  const upcomingThisYear = getEnemExamSundays(currentYear).find((d) => d.getTime() >= cutoff);
  if (upcomingThisYear) {
    return upcomingThisYear;
  }
  return getEnemExamSundays(currentYear + 1)[0];
}

function toInputDateValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function computeCountdown(target: Date, now: Date): CountdownParts {
  const diffMs = target.getTime() - now.getTime();
  const isExamToday =
    target.getFullYear() === now.getFullYear() &&
    target.getMonth() === now.getMonth() &&
    target.getDate() === now.getDate();

  if (diffMs <= 0) {
    return {
      totalMs: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isWithinOneMonth: isExamToday,
      isExamToday,
    };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // 1 mês antes do ENEM = até 31 dias restantes
  const isWithinOneMonth = days <= ENEM_COUNTDOWN_WINDOW_DAYS;

  return {
    totalMs: diffMs,
    days,
    hours,
    minutes,
    seconds,
    isWithinOneMonth,
    isExamToday,
  };
}

const DATE_DISPLAY_FORMAT = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

export function EnemCountdownBanner({
  userId,
  allowConfigOutsideWindow = false,
}: EnemCountdownBannerProps) {
  const hydrated = useHydrated();
  const savedGoal = useStudyGoalStore((state) => state.byUser[userId]);
  const setExamDate = useStudyGoalStore((state) => state.setExamDate);

  const [now, setNow] = useState<Date>(() => new Date());
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [hydrated]);

  if (!hydrated) return null;

  const targetDate = resolveTargetEnemDate(savedGoal?.examDate, now);
  const countdown = computeCountdown(targetDate, now);

  if (!countdown.isWithinOneMonth && !allowConfigOutsideWindow) {
    return (
      <div className="countdown-trigger">
        <div className="countdown-trigger__info">
          <Calendar size={16} aria-hidden="true" />
          <span>
            Próximo ENEM previsto para <strong>{DATE_DISPLAY_FORMAT.format(targetDate)}</strong> (faltam{' '}
            <strong>{countdown.days} dias</strong> — a contagem regressiva em tempo real aparecerá
            automaticamente quando faltar 1 mês).
          </span>
        </div>
        <div className="row">
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => {
              const simulated = new Date(Date.now() + 29 * 24 * 60 * 60 * 1000);
              setExamDate(userId, toInputDateValue(simulated));
            }}
          >
            <Flame size={14} aria-hidden="true" />
            Simular reta final (1 mês)
          </button>
          <EnemDatePicker
            value={toInputDateValue(targetDate)}
            hasCustomDate={Boolean(savedGoal?.examDate)}
            onChange={(newDateStr) => {
              setExamDate(userId, newDateStr);
              setSavedFeedback(true);
              setTimeout(() => setSavedFeedback(false), 3000);
            }}
            onResetOfficial={() => {
              setExamDate(userId, undefined);
              setSavedFeedback(true);
              setTimeout(() => setSavedFeedback(false), 3000);
            }}
          />
        </div>
      </div>
    );
  }

  const monthProgress = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        ((ENEM_COUNTDOWN_WINDOW_DAYS - countdown.days) / ENEM_COUNTDOWN_WINDOW_DAYS) * 100,
      ),
    ),
  );

  return (
    <section
      className={
        countdown.days <= 7
          ? 'enem-countdown enem-countdown--urgent'
          : 'enem-countdown'
      }
      aria-label="Contagem regressiva de 1 mês para o ENEM"
    >
      <div className="enem-countdown__top">
        <div className="enem-countdown__heading">
          <span className="enem-countdown__icon" aria-hidden="true">
            <AlarmClock size={22} />
          </span>
          <div>
            <div className="row" style={{ gap: 'var(--space-xs)' }}>
              <Badge tone="warning">
                <Flame size={13} aria-hidden="true" />
                Reta final · Último mês antes do ENEM
              </Badge>
              {savedFeedback ? (
                <Badge tone="positive">
                  <CheckCircle2 size={13} aria-hidden="true" />
                  Data atualizada
                </Badge>
              ) : null}
            </div>
            <h2 className="enem-countdown__title">
              {countdown.isExamToday
                ? 'É hoje! Boa prova no ENEM!'
                : `Falta menos de 1 mês para o ENEM (${DATE_DISPLAY_FORMAT.format(targetDate)})`}
            </h2>
            <p className="enem-countdown__subtitle">
              Aproveite os últimos dias para revisar seus resumos visuais e resolver provas anteriores.
            </p>
          </div>
        </div>

        <div className="row">
          <Link href="/app/resumos" className="btn btn--primary btn--sm">
            <NotebookPen size={15} aria-hidden="true" />
            Revisar meus resumos
          </Link>
          <EnemDatePicker
            value={toInputDateValue(targetDate)}
            hasCustomDate={Boolean(savedGoal?.examDate)}
            onChange={(newDateStr) => {
              setExamDate(userId, newDateStr);
              setSavedFeedback(true);
              setTimeout(() => setSavedFeedback(false), 3000);
            }}
            onResetOfficial={() => {
              setExamDate(userId, undefined);
              setSavedFeedback(true);
              setTimeout(() => setSavedFeedback(false), 3000);
            }}
          />
        </div>
      </div>

      <div className="enem-countdown__units" role="timer" aria-live="polite">
        <div className="enem-countdown__unit">
          <span className="enem-countdown__number tabular">
            {String(countdown.days).padStart(2, '0')}
          </span>
          <span className="enem-countdown__label">
            {countdown.days === 1 ? 'Dia' : 'Dias'}
          </span>
        </div>
        <div className="enem-countdown__unit">
          <span className="enem-countdown__number tabular">
            {String(countdown.hours).padStart(2, '0')}
          </span>
          <span className="enem-countdown__label">Horas</span>
        </div>
        <div className="enem-countdown__unit">
          <span className="enem-countdown__number tabular">
            {String(countdown.minutes).padStart(2, '0')}
          </span>
          <span className="enem-countdown__label">Minutos</span>
        </div>
        <div className="enem-countdown__unit">
          <span className="enem-countdown__number tabular">
            {String(countdown.seconds).padStart(2, '0')}
          </span>
          <span className="enem-countdown__label">Segundos</span>
        </div>
      </div>

      <ProgressBar
        label="Sprint de revisão de 30 dias"
        value={monthProgress}
        max={100}
        valueText={`${ENEM_COUNTDOWN_WINDOW_DAYS - countdown.days}/${ENEM_COUNTDOWN_WINDOW_DAYS} dias concluídos`}
        tone={countdown.days <= 7 ? 'warning' : 'positive'}
      />
    </section>
  );
}
