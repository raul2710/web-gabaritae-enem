'use client';

import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

interface EnemDatePickerProps {
  value: string;
  onChange: (dateStr: string) => void;
  onResetOfficial?: () => void;
  hasCustomDate?: boolean;
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

function parseDateStr(str: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split('-').map(Number);
    if (y && m && d) return new Date(y, m - 1, d, 12, 0, 0);
  }
  return new Date();
}

function formatIsoDate(year: number, monthIndex: number, day: number): string {
  const m = String(monthIndex + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

function getNovemberSundays(year: number): { first: string; second: string } {
  const novFirst = new Date(year, 10, 1, 12, 0, 0);
  const dow = novFirst.getDay();
  const offset = dow === 0 ? 0 : 7 - dow;
  const firstDay = 1 + offset;
  const secondDay = firstDay + 7;
  return {
    first: formatIsoDate(year, 10, firstDay),
    second: formatIsoDate(year, 10, secondDay),
  };
}

const DISPLAY_FORMAT = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export function EnemDatePicker({
  value,
  onChange,
  onResetOfficial,
  hasCustomDate = false,
}: EnemDatePickerProps) {
  const selectedDate = useMemo(() => parseDateStr(value), [value]);
  const [viewYear, setViewYear] = useState(() => selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => selectedDate.getMonth());
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setViewYear(selectedDate.getFullYear());
    setViewMonth(selectedDate.getMonth());
  }, [selectedDate]);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const calendarCells = useMemo(() => {
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const startWeekday = firstOfMonth.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const cells: Array<{ day: number | null; iso: string | null; isSunday: boolean }> = [];
    for (let i = 0; i < startWeekday; i++) {
      cells.push({ day: null, iso: null, isSunday: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = formatIsoDate(viewYear, viewMonth, d);
      const isSunday = new Date(viewYear, viewMonth, d).getDay() === 0;
      cells.push({ day: d, iso, isSunday });
    }
    return cells;
  }, [viewYear, viewMonth]);

  const todayIso = useMemo(() => {
    const now = new Date();
    return formatIsoDate(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const enemSundays = useMemo(() => getNovemberSundays(viewYear), [viewYear]);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function handleSelectIso(iso: string) {
    onChange(iso);
    setOpen(false);
  }

  return (
    <div className="enem-datepicker" ref={containerRef}>
      <button
        type="button"
        className={
          open
            ? 'custom-select__trigger custom-select__trigger--open enem-datepicker__trigger'
            : 'custom-select__trigger enem-datepicker__trigger'
        }
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span className="custom-select__value">
          <CalendarIcon size={16} style={{ color: 'var(--primary)' }} aria-hidden="true" />
          <span className="custom-select__label">
            {DISPLAY_FORMAT.format(selectedDate)}
          </span>
        </span>
        <span className="custom-select__badge">Alterar dia</span>
      </button>

      {open ? (
        <div
          className="enem-datepicker__popover"
          role="dialog"
          aria-label="Calendário do ENEM"
        >
          <div className="enem-datepicker__presets">
            <span className="enem-datepicker__presets-title">
              <Sparkles size={12} aria-hidden="true" />
              Atalhos oficiais ({viewYear}):
            </span>
            <div className="enem-datepicker__presets-row">
              <button
                type="button"
                className={
                  value === enemSundays.first
                    ? 'enem-datepicker__preset enem-datepicker__preset--active'
                    : 'enem-datepicker__preset'
                }
                onClick={() => handleSelectIso(enemSundays.first)}
              >
                1º Domingo ({enemSundays.first.slice(8, 10)}/11)
              </button>
              <button
                type="button"
                className={
                  value === enemSundays.second
                    ? 'enem-datepicker__preset enem-datepicker__preset--active'
                    : 'enem-datepicker__preset'
                }
                onClick={() => handleSelectIso(enemSundays.second)}
              >
                2º Domingo ({enemSundays.second.slice(8, 10)}/11)
              </button>
            </div>
          </div>

          <div className="enem-datepicker__header">
            <button
              type="button"
              className="enem-datepicker__nav-btn"
              onClick={prevMonth}
              aria-label="Mês anterior"
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <strong className="enem-datepicker__month-title">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </strong>
            <button
              type="button"
              className="enem-datepicker__nav-btn"
              onClick={nextMonth}
              aria-label="Próximo mês"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="enem-datepicker__weekdays" aria-hidden="true">
            {WEEKDAYS.map((wd) => (
              <span key={wd} className="enem-datepicker__weekday">
                {wd}
              </span>
            ))}
          </div>

          <div className="enem-datepicker__grid" role="grid">
            {calendarCells.map((cell, idx) => {
              if (!cell.day || !cell.iso) {
                return <span key={`empty-${idx}`} className="enem-datepicker__empty" />;
              }

              const isSelected = cell.iso === value;
              const isToday = cell.iso === todayIso;
              const isEnemSunday =
                cell.iso === enemSundays.first || cell.iso === enemSundays.second;

              const cellClass = [
                'enem-datepicker__day',
                isSelected ? 'enem-datepicker__day--selected' : '',
                isToday && !isSelected ? 'enem-datepicker__day--today' : '',
                isEnemSunday && !isSelected ? 'enem-datepicker__day--enem' : '',
                cell.isSunday && !isSelected ? 'enem-datepicker__day--sunday' : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <button
                  key={cell.iso}
                  type="button"
                  className={cellClass}
                  onClick={() => handleSelectIso(cell.iso!)}
                  title={
                    isEnemSunday
                      ? 'Domingo tradicional de aplicação do ENEM'
                      : undefined
                  }
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          {hasCustomDate && onResetOfficial ? (
            <div className="enem-datepicker__footer">
              <button
                type="button"
                className="enem-datepicker__reset-btn"
                onClick={() => {
                  onResetOfficial();
                  setOpen(false);
                }}
              >
                <RotateCcw size={13} aria-hidden="true" />
                Restaurar domingo oficial automático
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
