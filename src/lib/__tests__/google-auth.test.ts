import { afterEach, describe, expect, it, vi } from 'vitest';

import { GET, POST } from '@/app/api/auth/google/route';
import { SESSION_COOKIE, decodeSession } from '@/lib/auth';

describe('Google Auth API (/api/auth/google)', () => {
  const originalAuthMode = process.env.AUTH_MODE;

  afterEach(() => {
    process.env.AUTH_MODE = originalAuthMode;
    vi.restoreAllMocks();
  });

  it('POST em modo mock cria sessão com conta Google padrão quando nenhum dado é enviado', async () => {
    process.env.AUTH_MODE = 'mock';

    const request = new Request('http://localhost:3000/api/auth/google', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ provider: 'google' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const payload = (await response.json()) as {
      user: { id: string; name: string; email: string; avatarUrl?: string };
    };
    expect(payload.user).toEqual({
      id: 'google:estudante.google@gmail.com',
      name: 'Estudante Google',
      email: 'estudante.google@gmail.com',
      avatarUrl: expect.any(String),
    });

    const cookie = response.cookies.get(SESSION_COOKIE);
    expect(cookie?.value).toBeTruthy();
    expect(decodeSession(cookie?.value)).toEqual(payload.user);
  });

  it('POST em modo mock aceita e-mail e nome customizados da conta Google', async () => {
    process.env.AUTH_MODE = 'mock';

    const request = new Request('http://localhost:3000/api/auth/google', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'ana.silva@gmail.com', name: 'Ana Silva' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const payload = (await response.json()) as {
      user: { id: string; name: string; email: string; avatarUrl?: string };
    };
    expect(payload.user).toEqual({
      id: 'google:ana.silva@gmail.com',
      name: 'Ana Silva',
      email: 'ana.silva@gmail.com',
      avatarUrl: expect.any(String),
    });
  });

  it('POST em modo mock rejeita e-mail inválido', async () => {
    process.env.AUTH_MODE = 'mock';

    const request = new Request('http://localhost:3000/api/auth/google', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'email-invalido' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('GET em modo mock define o cookie de sessão e redireciona para o caminho sanitizado', async () => {
    process.env.AUTH_MODE = 'mock';

    const request = new Request('http://localhost:3000/api/auth/google?next=/app/simulados');
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/app/simulados');
    expect(decodeSession(response.cookies.get(SESSION_COOKIE)?.value)?.email).toBe(
      'estudante.google@gmail.com',
    );
  });
});
