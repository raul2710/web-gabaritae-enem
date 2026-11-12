'use client';

import { BookOpen, CalendarCheck, ClipboardList, Home, type LucideIcon, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { LogoutButton } from './LogoutButton';
import { Avatar } from '@/components/ui/Avatar';
import { Logo } from '@/components/ui/Logo';
import type { SessionUser } from '@/domain/types';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/app', label: 'Início', icon: Home },
  { href: '/app/provas', label: 'Provas', icon: ClipboardList },
  { href: '/app/estudar', label: 'Estudar', icon: BookOpen },
  { href: '/app/simulados', label: 'Simulados', icon: CalendarCheck },
  { href: '/app/perfil', label: 'Perfil', icon: User },
];

/** Bottom nav no mobile: 4 destinos principais (Simulados fica na sidebar/topbar). */
const BOTTOM_NAV_ITEMS = NAV_ITEMS.filter((item) => item.href !== '/app/simulados');

/** Exato para `/app`; por prefixo para as demais rotas. */
function isActivePath(pathname: string, href: string): boolean {
  if (href === '/app') return pathname === '/app';
  return pathname === href || pathname.startsWith(`${href}/`);
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? '';
}

interface AppShellProps {
  user: SessionUser;
  children: ReactNode;
}

export function AppShell({ user, children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navegação da área do aluno">
        <Logo href="/app" />

        <nav className="sidebar__nav" aria-label="Seções da área do aluno">
          {NAV_ITEMS.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? 'sidebar__link sidebar__link--active' : 'sidebar__link'}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <Avatar name={user.name} />
            <span className="sidebar__user-info">
              <span className="sidebar__user-name">{user.name}</span>
              <span className="sidebar__user-email">{user.email}</span>
            </span>
          </div>
          <LogoutButton />
        </div>
      </aside>

      <header className="app-topbar">
        <Logo href="/app" />
        <span className="app-topbar__name">{firstName(user.name)}</span>
        <LogoutButton>Sair</LogoutButton>
      </header>

      <main id="conteudo" className="app-shell__main">
        <div className="container">{children}</div>
      </main>

      <nav className="bottom-nav" aria-label="Navegação principal">
        <ul className="bottom-nav__list">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={
                    active ? 'bottom-nav__link bottom-nav__link--active' : 'bottom-nav__link'
                  }
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon size={20} aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
