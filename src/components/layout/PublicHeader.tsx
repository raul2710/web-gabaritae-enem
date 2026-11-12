import Link from 'next/link';

import { Logo } from '@/components/ui/Logo';

const NAV_LINKS = [
  { href: '/provas', label: 'Provas' },
  { href: '/#como-funciona', label: 'Como funciona' },
  { href: '/#areas', label: 'Áreas' },
];

export function PublicHeader() {
  return (
    <header className="public-header">
      <div className="container public-header__inner">
        <Logo href="/" />

        <nav className="public-nav" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="public-nav__link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="public-header__actions">
          <Link href="/entrar" className="btn btn--secondary btn--sm">
            Entrar
          </Link>
          <Link href="/criar-conta" className="btn btn--primary btn--sm">
            Criar conta
          </Link>
        </div>
      </div>
    </header>
  );
}
