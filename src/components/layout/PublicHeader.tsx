import Link from 'next/link';

import { Logo } from '@/components/ui/Logo';
import { UserMenu } from '@/components/layout/UserMenu';
import { PixButton } from '@/components/pix/PixButton';
import { getSession } from '@/lib/auth';

const PUBLIC_NAV_LINKS = [
  { href: '/provas', label: 'Provas' },
  { href: '/#como-funciona', label: 'Como funciona' },
  { href: '/#areas', label: 'Áreas' },
];

const AUTH_NAV_LINKS = [
  { href: '/app', label: 'Painel' },
  { href: '/app/provas', label: 'Provas' },
  { href: '/app/estudar', label: 'Estudar' },
  { href: '/app/simulados', label: 'Simulados' },
];

export async function PublicHeader() {
  const user = await getSession();
  const navLinks = user ? AUTH_NAV_LINKS : PUBLIC_NAV_LINKS;

  return (
    <header className="public-header">
      <div className="container public-header__inner">
        <Logo href="/" />

        <nav className="public-nav" aria-label="Navegação principal">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="public-nav__link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="public-header__actions">
          <PixButton variant="pill" label="Apoiar com Pix" />
          {user ? (
            <>
              <Link
                href="/app"
                className="btn btn--primary btn--sm public-header__app-btn"
              >
                Área do aluno
              </Link>
              <UserMenu user={user} showAppDashboardLink />
            </>
          ) : (
            <>
              <Link href="/entrar" className="btn btn--secondary btn--sm">
                Entrar
              </Link>
              <Link href="/criar-conta" className="btn btn--primary btn--sm">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
