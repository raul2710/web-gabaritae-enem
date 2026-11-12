import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import type { SessionUser } from '@/domain/types';

/** Cookie que carrega a sessão (mock ou API). */
export const SESSION_COOKIE = 'gabaritae_session';

/** 7 dias. */
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export interface SessionCookieOptions {
  httpOnly: boolean;
  sameSite: 'lax';
  secure: boolean;
  path: string;
  maxAge: number;
}

export const sessionCookieOptions: SessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: SESSION_MAX_AGE_SECONDS,
};

export function encodeSession(user: SessionUser): string {
  return Buffer.from(JSON.stringify(user), 'utf8').toString('base64url');
}

export function decodeSession(raw: string | undefined | null): SessionUser | null {
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'));
    if (!parsed || typeof parsed !== 'object') return null;

    const candidate = parsed as Partial<SessionUser>;
    if (!candidate.id || !candidate.email) return null;

    return {
      id: String(candidate.id),
      name: String(candidate.name ?? ''),
      email: String(candidate.email),
    };
  } catch {
    return null;
  }
}

/** Lê a sessão do cookie atual (App Router: `cookies()` é assíncrono). */
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  return decodeSession(store.get(SESSION_COOKIE)?.value);
}

/** Exige sessão válida; caso contrário redireciona para `/entrar`. */
export async function requireSession(nextPath?: string): Promise<SessionUser> {
  const user = await getSession();

  if (!user) {
    redirect(nextPath ? `/entrar?next=${encodeURIComponent(nextPath)}` : '/entrar');
  }

  return user;
}

/**
 * Sanitiza o parâmetro `next` da query string: só caminhos internos
 * (começam com `/`, sem `//` nem `/\`), com fallback em `/app`.
 * Evita open redirect para domínios externos após o login.
 */
export function sanitizeNextPath(next: string | string[] | undefined, fallback = '/app'): string {
  const value = Array.isArray(next) ? next[0] : next;
  if (!value || typeof value !== 'string') return fallback;
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return fallback;

  // Controles e quebras de linha não podem aparecer em um redirecionamento.
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code < 32 || code === 127) return fallback;
  }

  return value;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}

/** Deriva um nome de exibição a partir do e-mail (`maria.souza@x.com` → `Maria Souza`). */
export function deriveNameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? '';

  const name = local
    .split(/[._\-+]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return name || 'Estudante';
}

/**
 * Normaliza a resposta da API Java para `SessionUser`.
 * Aceita os formatos `{ user: {...} }` e `{ token, user: {...} }`
 * (ou um usuário direto no corpo da resposta).
 */
export function extractSessionUser(payload: unknown): SessionUser | null {
  if (!payload || typeof payload !== 'object') return null;

  const record = payload as Record<string, unknown>;
  const rawUser =
    record.user && typeof record.user === 'object'
      ? (record.user as Record<string, unknown>)
      : record;

  const email = String(rawUser.email ?? '').trim();
  if (!email) return null;

  const id = String(rawUser.id ?? rawUser.userId ?? record.id ?? email);
  const name = String(rawUser.name ?? rawUser.nome ?? deriveNameFromEmail(email));

  return { id, name, email };
}
