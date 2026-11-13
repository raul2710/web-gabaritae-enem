import { NextResponse } from 'next/server';

import { JAVA_API_URL } from '@/lib/api';
import {
  SESSION_COOKIE,
  deriveNameFromEmail,
  encodeSession,
  extractSessionUser,
  getDefaultAvatarUrl,
  isValidEmail,
  sanitizeNextPath,
  sessionCookieOptions,
} from '@/lib/auth';
import type { SessionUser } from '@/domain/types';

const API_TIMEOUT_MS = 5000;
const MOCK_GOOGLE_EMAIL = 'estudante.google@gmail.com';
const MOCK_GOOGLE_NAME = 'Estudante Google';

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

async function loginWithGoogleViaApi(payload: Record<string, unknown>): Promise<NextResponse> {
  try {
    const upstream = await fetch(`${JAVA_API_URL}/auth/google`, {
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
          : 'Não foi possível entrar com o Google.';
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
  const credential = typeof body.credential === 'string' ? body.credential.trim() : '';

  if (process.env.AUTH_MODE === 'api') {
    return loginWithGoogleViaApi({
      ...body,
      ...(credential ? { credential } : {}),
    });
  }

  // Modo mock: aceita e-mail/nome opcionais ou usa a conta Google de demonstração.
  const rawEmail = String(body.email ?? '').trim().toLowerCase();
  const email = rawEmail || MOCK_GOOGLE_EMAIL;

  if (!isValidEmail(email)) {
    return errorResponse('Informe um e-mail Google válido.', 400);
  }

  const rawName = String(body.name ?? body.nome ?? '').trim();
  const name =
    rawName || (email === MOCK_GOOGLE_EMAIL ? MOCK_GOOGLE_NAME : deriveNameFromEmail(email));

  const user: SessionUser = {
    id: `google:${email}`,
    name,
    email,
    avatarUrl: getDefaultAvatarUrl(name, email),
  };

  return sessionResponse(user);
}

export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const nextPath = sanitizeNextPath(url.searchParams.get('next') ?? undefined);

  if (process.env.AUTH_MODE === 'api') {
    const redirectUrl = new URL(`${JAVA_API_URL}/auth/google`);
    redirectUrl.searchParams.set('next', nextPath);
    return NextResponse.redirect(redirectUrl);
  }

  const user: SessionUser = {
    id: `google:${MOCK_GOOGLE_EMAIL}`,
    name: MOCK_GOOGLE_NAME,
    email: MOCK_GOOGLE_EMAIL,
    avatarUrl: getDefaultAvatarUrl(MOCK_GOOGLE_NAME, MOCK_GOOGLE_EMAIL),
  };

  const response = NextResponse.redirect(new URL(nextPath, request.url));
  response.cookies.set(SESSION_COOKIE, encodeSession(user), sessionCookieOptions);
  return response;
}
