import Link from 'next/link';

interface LogoProps {
  href?: string;
  className?: string;
}

export function Logo({ href = '/', className = '' }: LogoProps) {
  const content = (
    <>
      <span className="logo__mark" aria-hidden="true">
        G
      </span>
      <span>
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
