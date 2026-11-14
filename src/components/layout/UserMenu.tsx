'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, Info, LayoutDashboard, LogOut, NotebookPen, User as UserIcon } from 'lucide-react';

import { Avatar } from '@/components/ui/Avatar';
import type { SessionUser } from '@/domain/types';

interface UserMenuProps {
  user: SessionUser;
  /** Mostra o atalho para o painel de estudos (útil nas páginas públicas). */
  showAppDashboardLink?: boolean;
}

export function UserMenu({ user, showAppDashboardLink = true }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  async function handleLogout() {
    if (loading) return;
    setLoading(true);

    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Falha de rede silenciosa; o router refresh atualiza os cookies
    } finally {
      setLoading(false);
      setOpen(false);
      router.push('/');
      router.refresh();
    }
  }

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        type="button"
        className={open ? 'user-menu__trigger user-menu__trigger--open' : 'user-menu__trigger'}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Menu de ${user.name}`}
      >
        <Avatar name={user.name} image={user.avatarUrl} size="sm" />
        <span className="user-menu__name">{user.name}</span>
        <ChevronDown
          size={14}
          className={open ? 'user-menu__chevron user-menu__chevron--open' : 'user-menu__chevron'}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="user-menu__dropdown" role="menu">
          <div className="user-menu__header">
            <Avatar name={user.name} image={user.avatarUrl} size="md" />
            <div className="user-menu__identity">
              <span className="user-menu__header-name">{user.name}</span>
              <span className="user-menu__header-email">{user.email}</span>
            </div>
          </div>

          <div className="user-menu__divider" />

          <nav className="user-menu__links">
            {showAppDashboardLink ? (
              <Link
                href="/app"
                className="user-menu__item"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <LayoutDashboard size={16} aria-hidden="true" />
                <span>Área do aluno</span>
              </Link>
            ) : null}

            <Link
              href="/app/resumos"
              className="user-menu__item"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <NotebookPen size={16} aria-hidden="true" />
              <span>Meus resumos</span>
            </Link>

            <Link
              href="/app/perfil"
              className="user-menu__item"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <UserIcon size={16} aria-hidden="true" />
              <span>Meu perfil</span>
            </Link>

            <Link
              href="/app/info"
              className="user-menu__item"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <Info size={16} aria-hidden="true" />
              <span>Info & Apoie</span>
            </Link>
          </nav>

          <div className="user-menu__divider" />

          <button
            type="button"
            className="user-menu__item user-menu__item--logout"
            role="menuitem"
            onClick={handleLogout}
            disabled={loading}
          >
            <LogOut size={16} aria-hidden="true" />
            <span>{loading ? 'Saindo...' : 'Sair da conta'}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
