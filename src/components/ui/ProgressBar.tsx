interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  valueText?: string;
  tone?: 'default' | 'positive' | 'warning' | 'negative';
}

export function ProgressBar({
  label,
  value,
  max,
  valueText,
  tone = 'default',
}: ProgressBarProps) {
  const safeMax = max > 0 ? max : 1;
  const percent = Math.min(100, Math.max(0, Math.round((value / safeMax) * 100)));
  const toneClass = tone === 'default' ? '' : `progress--${tone}`;

  return (
    <div className={['progress', toneClass].filter(Boolean).join(' ')}>
      <div className="progress__label">
        <span>{label}</span>
        <span className="progress__value">{valueText ?? `${percent}%`}</span>
      </div>
      <div
        className="progress__track"
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div className="progress__bar" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
