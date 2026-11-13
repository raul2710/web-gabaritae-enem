'use client';

import {
  BookOpen,
  CalendarCheck,
  ClipboardList,
  Heart,
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
import { useEffect, useState, type ReactNode } from 'react';

import { LogoutButton } from './LogoutButton';
import { UserMenu } from './UserMenu';
import { PixButton } from '@/components/pix/PixButton';
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

interface AppShellProps {
  user: SessionUser;
  children: ReactNode;
}

export function AppShell({ user, children }: AppShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Fecha o drawer mobile ao navegar para uma nova rota
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  // Fecha o drawer mobile ao pressionar ESC
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Trava a rolagem de fundo no mobile enquanto o drawer estiver aberto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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

        {/* Dedicatória com amor para a futura esposa */}
        <div
          className="sidebar__tribute"
          role="region"
          aria-label="Dedicatória de amor"
          title={
            collapsed
              ? 'Feito com amor para o meu amor gabaritar aê! ❤️ (Clique para expandir)'
              : undefined
          }
          onClick={collapsed ? () => setCollapsed(false) : undefined}
        >
          <div className="sidebar__tribute-header">
            <Heart
              size={16}
              className="sidebar__tribute-heart"
              aria-hidden="true"
              fill="currentColor"
            />
            <span className="sidebar__tribute-tag">Feito com Amor</span>
          </div>
          <p className="sidebar__tribute-text">
            Criado para ajudar minha namorada e futura esposa a alcançar seus objetivos, estudando de
            forma fácil.
          </p>
          <span className="sidebar__tribute-quote">Para o meu amor gabaritar aê! ❤️</span>
        </div>

        <div className="sidebar__pix-wrap" style={{ padding: '0 var(--space-md)', marginBottom: 'var(--space-sm)' }}>
          <PixButton variant="sidebar" label="Apoiar com Pix (R$ 19,90)" />
        </div>

        <div className="sidebar__footer">
          <Link
            href="/app/perfil"
            onClick={() => setMobileMenuOpen(false)}
            className="sidebar__user"
            title={collapsed ? `${user.name} (${user.email})` : undefined}
          >
            <Avatar name={user.name} image={user.avatarUrl} />
            <span className="sidebar__user-info">
              <span className="sidebar__user-name">{user.name}</span>
              <span className="sidebar__user-email">{user.email}</span>
            </span>
          </Link>
          <LogoutButton compact={collapsed} />
        </div>
      </aside>

      <header className="app-topbar">
        <div className="app-topbar__left">
          <button
            type="button"
            className="app-topbar__menu-btn"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menu de navegação"
            aria-expanded={mobileMenuOpen}
            aria-controls="app-sidebar"
          >
            <Menu size={22} aria-hidden="true" />
          </button>
          <Logo href="/app" />
        </div>
        <div className="row" style={{ alignItems: 'center', gap: 'var(--space-sm)' }}>
          <PixButton variant="pill" label="Apoiar com Pix" />
          <UserMenu user={user} showAppDashboardLink={false} />
        </div>
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
          <li>
            <button
              type="button"
              className={
                mobileMenuOpen
                  ? 'bottom-nav__link bottom-nav__link--active'
                  : 'bottom-nav__link'
              }
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Fechar menu lateral' : 'Abrir menu lateral'}
              aria-expanded={mobileMenuOpen}
              aria-controls="app-sidebar"
            >
              <Menu size={20} aria-hidden="true" />
              Menu
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
