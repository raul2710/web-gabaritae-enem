'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';

interface LogoutButtonProps {
  children?: ReactNode;
  className?: string;
  compact?: boolean;
  title?: string;
}

/** Encerra a sessão (limpa o cookie) e volta para a página pública inicial. */
export function LogoutButton({
  children,
  className = '',
  compact = false,
  title,
}: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);

    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Sem conexão o cookie pode permanecer; o proxy/layout seguem protegendo as rotas.
    } finally {
      setLoading(false);
      router.push('/');
      router.refresh();
    }
  }

  const label = loading ? 'Saindo...' : (children ?? 'Sair');

  return (
    <button
      type="button"
      className={['btn', 'btn--ghost', 'btn--sm', className].filter(Boolean).join(' ')}
      onClick={handleClick}
      disabled={loading}
      aria-label={typeof label === 'string' ? label : 'Sair'}
      title={title ?? (typeof label === 'string' ? label : 'Sair')}
    >
      <LogOut size={16} aria-hidden="true" />
      <span className={compact ? 'sr-only' : undefined}>{label}</span>
    </button>
  );
}
