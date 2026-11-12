import { NextResponse, type NextRequest } from 'next/server';

import { SESSION_COOKIE } from '@/lib/auth';

/**
 * Next 16: o Middleware anterior passou a se chamar Proxy.
 * Protege a área do aluno (`/app/*`): sem cookie de sessão, manda para `/entrar`.
 */
export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (!request.cookies.has(SESSION_COOKIE)) {
    const loginUrl = new URL('/entrar', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*'],
};
