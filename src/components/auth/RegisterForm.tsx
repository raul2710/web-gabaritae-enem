'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';

interface RegisterFormProps {
  /** Caminho validado no server component para onde a sessão deve ir. */
  nextPath: string;
  /** Mostra a dica de demonstração apenas em modo mock. */
  isMockMode?: boolean;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

type Field = 'name' | 'email' | 'password' | 'confirm';
type ErrorState = { field?: Field; message: string } | null;

function readErrorMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object' && 'error' in payload) {
    const message = (payload as { error: unknown }).error;
    if (typeof message === 'string' && message.trim()) return message;
  }
  return fallback;
}

export function RegisterForm({ nextPath, isMockMode = false }: RegisterFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<ErrorState>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const isBusy = loading || googleLoading;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isBusy) return;
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setError({ field: 'name', message: 'Informe seu nome.' });
      return;
    }
    if (!trimmedEmail) {
      setError({ field: 'email', message: 'Informe seu e-mail.' });
      return;
    }
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError({ field: 'email', message: 'Informe um e-mail válido.' });
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError({
        field: 'password',
        message: `A senha precisa ter ao menos ${MIN_PASSWORD_LENGTH} caracteres.`,
      });
      return;
    }
    if (confirm !== password) {
      setError({ field: 'confirm', message: 'As senhas não coincidem.' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail, password }),
      });

      const data: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        setError({
          message: readErrorMessage(data, 'Não foi possível criar a conta.'),
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

  const invalid = (field: Field) => (error?.field === field ? error.message : undefined);

  function fieldError(field: Field) {
    const message = invalid(field);
    if (!message) return null;

    return (
      <span className="form-error form-error--field" id={`register-${field}-error`} role="alert">
        {message}
      </span>
    );
  }

  const formError = error && !error.field ? error.message : undefined;

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {formError ? (
        <p className="form-error" role="alert">
          {formError}
        </p>
      ) : null}

      <GoogleAuthButton
        nextPath={nextPath}
        label="Cadastrar com o Google"
        disabled={loading}
        onLoadingChange={setGoogleLoading}
        onError={(message) => setError(message ? { message } : null)}
      />

      <div className="auth-divider" role="separator" aria-label="ou preencha seus dados">
        <span>ou crie com seu e-mail</span>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="register-name">
          Nome
        </label>
        <input
          id="register-name"
          className="input"
          type="text"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Como quer ser chamado(a)"
          autoComplete="name"
          required
          disabled={isBusy}
          aria-invalid={Boolean(invalid('name')) || undefined}
          aria-describedby={invalid('name') ? 'register-name-error' : undefined}
        />
        {fieldError('name')}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="register-email">
          E-mail
        </label>
        <input
          id="register-email"
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
          aria-invalid={Boolean(invalid('email')) || undefined}
          aria-describedby={invalid('email') ? 'register-email-error' : undefined}
        />
        {fieldError('email')}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="register-password">
          Senha
        </label>
        <input
          id="register-password"
          className="input"
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Mínimo de 6 caracteres"
          autoComplete="new-password"
          required
          disabled={isBusy}
          aria-invalid={Boolean(invalid('password')) || undefined}
          aria-describedby={
            invalid('password')
              ? 'register-password-hint register-password-error'
              : 'register-password-hint'
          }
        />
        <span className="field-hint" id="register-password-hint">
          Use ao menos {MIN_PASSWORD_LENGTH} caracteres.
        </span>
        {fieldError('password')}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="register-confirm">
          Confirmar senha
        </label>
        <input
          id="register-confirm"
          className="input"
          type="password"
          name="confirm"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          placeholder="Digite a senha novamente"
          autoComplete="new-password"
          required
          disabled={isBusy}
          aria-invalid={Boolean(invalid('confirm')) || undefined}
          aria-describedby={invalid('confirm') ? 'register-confirm-error' : undefined}
        />
        {fieldError('confirm')}
      </div>

      <button type="submit" className="btn btn--primary btn--block" disabled={isBusy}>
        {loading ? 'Criando conta...' : 'Criar conta'}
      </button>

      {isMockMode ? (
        <p className="auth-form__note">
          Demonstração: use qualquer e-mail e senha com 6+ caracteres.
        </p>
      ) : null}

      <p className="auth-form__alt">
        Já tem conta? <Link href={`/entrar?next=${encodeURIComponent(nextPath)}`}>Entrar</Link>
      </p>
    </form>
  );
}
