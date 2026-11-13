import Link from 'next/link';

interface LogoProps {
  href?: string;
  className?: string;
  compact?: boolean;
}

export function Logo({ href = '/', className = '', compact = false }: LogoProps) {
  const content = (
    <>
      <span className="logo__mark" aria-hidden="true">
        G
      </span>
      <span className={compact ? 'logo__text logo__text--compact' : 'logo__text'}>
        Gabarita<span className="logo__accent">ê</span>
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={['logo', className].filter(Boolean).join(' ')}>
        {content}
      </Link>
    );
  }

  return <span className={['logo', className].filter(Boolean).join(' ')}>{content}</span>;
}
