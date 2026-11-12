import type { ReactNode } from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeader({ eyebrow, title, description, action }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div className="section-header__text">
        {eyebrow ? <span className="section-header__eyebrow">{eyebrow}</span> : null}
        <h2>{title}</h2>
        {description ? <p className="section-header__description">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
