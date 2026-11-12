import type { ElementType, ReactNode } from 'react';

interface CardProps {
  as?: ElementType;
  tone?: 'surface' | 'tonal' | 'subtle';
  className?: string;
  children: ReactNode;
}

export function Card({ as: Tag = 'div', tone = 'surface', className = '', children }: CardProps) {
  const toneClass = tone === 'surface' ? '' : `card--${tone}`;

  return <Tag className={['card', toneClass, className].filter(Boolean).join(' ')}>{children}</Tag>;
}
