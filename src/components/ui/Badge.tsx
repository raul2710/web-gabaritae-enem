import type { ReactNode } from 'react';

export type BadgeTone =
  | 'neutral'
  | 'primary'
  | 'positive'
  | 'negative'
  | 'warning'
  | 'azul'
  | 'amarela'
  | 'branca'
  | 'rosa';

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}

export function Badge({ tone = 'neutral', children, className = '' }: BadgeProps) {
  const toneClass = tone === 'neutral' ? '' : `badge--${tone}`;

  return <span className={['badge', toneClass, className].filter(Boolean).join(' ')}>{children}</span>;
}
