import { NextResponse } from 'next/server';

import { JAVA_API_URL } from '@/lib/api';
import {
  SESSION_COOKIE,
  encodeSession,
  extractSessionUser,
  getDefaultAvatarUrl,
  isValidEmail,
  sessionCookieOptions,
} from '@/lib/auth';
import type { SessionUser } from '@/domain/types';

const API_TIMEOUT_MS = 5000;
const MIN_PASSWORD_LENGTH = 6;

function errorResponse(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

function sessionResponse(user: SessionUser): NextResponse {
  const response = NextResponse.json({ user });
  response.cookies.set(SESSION_COOKIE, encodeSession(user), sessionCookieOptions);
  return response;
}

async function readBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const body: unknown = await request.json();
    if (body && typeof body === 'object' && !Array.isArray(body)) {
      return body as Record<string, unknown>;
    }
  } catch {
    // corpo ausente ou inválido
  }
  return {};
}

async function registerViaApi(payload: Record<string, unknown>): Promise<NextResponse> {
  try {
    const upstream = await fetch(`${JAVA_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
      cache: 'no-store',
    });

    const data: unknown = await upstream.json().catch(() => null);

    if (!upstream.ok) {
      const message =
        data && typeof data === 'object' && 'error' in data
          ? String((data as Record<string, unknown>).error)
          : 'Não foi possível criar a conta.';
      return errorResponse(message, upstream.status >= 400 ? upstream.status : 401);
    }

    const user = extractSessionUser(data);
    if (!user) {
      return errorResponse('Resposta inválida da API de autenticação.', 401);
    }

    return sessionResponse(user);
  } catch {
    return errorResponse('Serviço indisponível no momento. Tente novamente.', 401);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = await readBody(request);

  const name = String(body.name ?? body.nome ?? '').trim();
  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');

  if (!name) {
    return errorResponse('Informe seu nome.', 400);
  }
  if (!isValidEmail(email)) {
    return errorResponse('Informe um e-mail válido.', 400);
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return errorResponse(`A senha precisa ter ao menos ${MIN_PASSWORD_LENGTH} caracteres.`, 400);
  }

  if (process.env.AUTH_MODE === 'api') {
    return registerViaApi({ name, email, password });
  }

  const user: SessionUser = {
    id: `mock:${email}`,
    name,
    email,
    avatarUrl: getDefaultAvatarUrl(name, email),
  };

  return sessionResponse(user);
}
