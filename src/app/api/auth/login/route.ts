import { NextResponse } from 'next/server';

import { JAVA_API_URL } from '@/lib/api';
import {
  SESSION_COOKIE,
  deriveNameFromEmail,
  encodeSession,
  extractSessionUser,
  isValidEmail,
  sessionCookieOptions,
} from '@/lib/auth';
import type { SessionUser } from '@/domain/types';

/** Timeout generoso o bastante para a API real, curto o bastante para não prender a UI. */
const API_TIMEOUT_MS = 5000;

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

async function loginViaApi(email: string, password: string): Promise<NextResponse> {
  try {
    const upstream = await fetch(`${JAVA_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ email, password }),
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
      cache: 'no-store',
    });

    const data: unknown = await upstream.json().catch(() => null);

    if (!upstream.ok) {
      const message =
        data && typeof data === 'object' && 'error' in data
          ? String((data as Record<string, unknown>).error)
          : 'Não foi possível entrar. Verifique seus dados.';
      return errorResponse(message, 401);
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
  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');

  if (process.env.AUTH_MODE === 'api') {
    return loginViaApi(email, password);
  }

  // Modo mock: valida localmente e cria a sessão no cookie.
  if (!isValidEmail(email)) {
    return errorResponse('Informe um e-mail válido.', 400);
  }
  if (password.length < 6) {
    return errorResponse('A senha precisa ter ao menos 6 caracteres.', 400);
  }

  const user: SessionUser = {
    id: `mock:${email}`,
    name: deriveNameFromEmail(email),
    email,
  };

  return sessionResponse(user);
}
