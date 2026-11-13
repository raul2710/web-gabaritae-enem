import Link from 'next/link';

import { Avatar } from '@/components/ui/Avatar';
import { Logo } from '@/components/ui/Logo';
import { LogoutButton } from '@/components/layout/LogoutButton';
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
        <Logo href={user ? '/app' : '/'} />

        <nav className="public-nav" aria-label="Navegação principal">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="public-nav__link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="public-header__actions">
          {user ? (
            <>
              <Link href="/app/perfil" className="public-header__user" title="Abrir perfil">
                <Avatar name={user.name} />
                <span className="public-header__user-name">{user.name}</span>
              </Link>
              <Link href="/app" className="btn btn--primary btn--sm">
                Área do aluno
              </Link>
              <LogoutButton />
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
