'use client';

import {
  BookOpen,
  CalendarCheck,
  ClipboardList,
  Home,
  type LucideIcon,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';

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

/** Bottom nav no mobile: 4 destinos principais. */
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
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const shellClassName = [
    'app-shell',
    collapsed ? 'app-shell--collapsed' : '',
    mobileMenuOpen ? 'app-shell--drawer-open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={shellClassName}>
      {mobileMenuOpen ? (
        <div
          className="sidebar-backdrop"
          aria-hidden="true"
          onClick={() => setMobileMenuOpen(false)}
        />
      ) : null}

      <aside
        id="app-sidebar"
        className={collapsed ? 'sidebar sidebar--collapsed' : 'sidebar'}
        aria-label="Navegação da área do aluno"
      >
        <div className="sidebar__header">
          <Logo href="/app" compact={collapsed} />

          <button
            type="button"
            className="sidebar__toggle sidebar__toggle--desktop"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            title={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
          >
            {collapsed ? (
              <PanelLeftOpen size={18} aria-hidden="true" />
            ) : (
              <PanelLeftClose size={18} aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            className="sidebar__toggle sidebar__toggle--mobile"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <nav className="sidebar__nav" aria-label="Seções da área do aluno">
          {NAV_ITEMS.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={active ? 'sidebar__link sidebar__link--active' : 'sidebar__link'}
                aria-current={active ? 'page' : undefined}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} aria-hidden="true" />
                <span className="sidebar__link-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar__footer">
          <Link
            href="/app/perfil"
            onClick={() => setMobileMenuOpen(false)}
            className="sidebar__user"
            title={collapsed ? `${user.name} (${user.email})` : undefined}
          >
            <Avatar name={user.name} />
            <span className="sidebar__user-info">
              <span className="sidebar__user-name">{user.name}</span>
              <span className="sidebar__user-email">{user.email}</span>
            </span>
          </Link>
          <LogoutButton compact={collapsed} />
        </div>
      </aside>

      <header className="app-topbar">
        <button
          type="button"
          className="app-topbar__menu-btn"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Abrir menu lateral"
          aria-expanded={mobileMenuOpen}
          aria-controls="app-sidebar"
        >
          <Menu size={20} aria-hidden="true" />
        </button>
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
