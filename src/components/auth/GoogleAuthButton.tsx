'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface GoogleAuthButtonProps {
  nextPath: string;
  label?: string;
  disabled?: boolean;
  onError?: (message: string) => void;
  onLoadingChange?: (loading: boolean) => void;
}

function readErrorMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object' && 'error' in payload) {
    const message = (payload as { error: unknown }).error;
    if (typeof message === 'string' && message.trim()) return message;
  }
  return fallback;
}

export function GoogleAuthButton({
  nextPath,
  label = 'Continuar com o Google',
  disabled = false,
  onError,
  onLoadingChange,
}: GoogleAuthButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    if (loading || disabled) return;

    setLoading(true);
    onLoadingChange?.(true);
    onError?.('');

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ provider: 'google' }),
      });

      const data: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        onError?.(readErrorMessage(data, 'Não foi possível entrar com o Google.'));
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      onError?.('Serviço indisponível no momento. Tente novamente.');
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  }

  return (
    <button
      type="button"
      className="btn btn--secondary btn--block btn--google"
      onClick={handleGoogleSignIn}
      disabled={disabled || loading}
    >
      <svg
        className="btn__google-icon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      <span>{loading ? 'Conectando ao Google...' : label}</span>
    </button>
  );
}
