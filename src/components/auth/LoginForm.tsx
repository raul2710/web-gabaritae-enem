'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';

interface LoginFormProps {
  /** Caminho validado no server component para onde a sessão deve ir. */
  nextPath: string;
  /** Mostra a dica de demonstração apenas em modo mock. */
  isMockMode?: boolean;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ErrorState = { field?: 'email' | 'password'; message: string } | null;

function readErrorMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object' && 'error' in payload) {
    const message = (payload as { error: unknown }).error;
    if (typeof message === 'string' && message.trim()) return message;
  }
  return fallback;
}

export function LoginForm({ nextPath, isMockMode = false }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ErrorState>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const isBusy = loading || googleLoading;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isBusy) return;
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError({ field: 'email', message: 'Informe seu e-mail.' });
      return;
    }
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError({ field: 'email', message: 'Informe um e-mail válido.' });
      return;
    }
    if (password.length < 6) {
      setError({ field: 'password', message: 'A senha precisa ter ao menos 6 caracteres.' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const data: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        setError({
          message: readErrorMessage(data, 'Não foi possível entrar. Verifique seus dados.'),
        });
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setError({ message: 'Serviço indisponível no momento. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  }

  const emailInvalid = error?.field === 'email';
  const passwordInvalid = error?.field === 'password';

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {error && !error.field ? (
        <p className="form-error" role="alert">
          {error.message}
        </p>
      ) : null}

      <GoogleAuthButton
        nextPath={nextPath}
        label="Entrar com o Google"
        disabled={loading}
        onLoadingChange={setGoogleLoading}
        onError={(message) => setError(message ? { message } : null)}
      />

      <div className="auth-divider" role="separator" aria-label="ou use seu e-mail">
        <span>ou continue com seu e-mail</span>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="login-email">
          E-mail
        </label>
        <input
          id="login-email"
          className="input"
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="voce@exemplo.com"
          autoComplete="email"
          inputMode="email"
          required
          disabled={isBusy}
          aria-invalid={emailInvalid || undefined}
          aria-describedby={emailInvalid ? 'login-email-error' : undefined}
        />
        {emailInvalid ? (
          <span className="form-error form-error--field" id="login-email-error" role="alert">
            {error?.message}
          </span>
        ) : null}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="login-password">
          Senha
        </label>
        <input
          id="login-password"
          className="input"
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
          disabled={isBusy}
          aria-invalid={passwordInvalid || undefined}
          aria-describedby={passwordInvalid ? 'login-password-error' : undefined}
        />
        {passwordInvalid ? (
          <span className="form-error form-error--field" id="login-password-error" role="alert">
            {error?.message}
          </span>
        ) : null}
      </div>

      <button type="submit" className="btn btn--primary btn--block" disabled={isBusy}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>

      {isMockMode ? (
        <p className="auth-form__note">
          Demonstração: use qualquer e-mail e senha com 6+ caracteres.
        </p>
      ) : null}

      <p className="auth-form__alt">
        Não tem conta?{' '}
        <Link href={`/criar-conta?next=${encodeURIComponent(nextPath)}`}>Criar conta</Link>
      </p>
    </form>
  );
}
