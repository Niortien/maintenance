import { NextRequest, NextResponse } from 'next/server';

const PROTECTED = ['/dashboard'];
const PUBLIC_ONLY = ['/login'];
const TOKEN_COOKIE = 'auth_token';

export function middleware(req: NextRequest) {
  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  const { pathname } = req.nextUrl;

  // Routes protégées → rediriger vers /login si pas de token
  if (PROTECTED.some((p) => pathname.startsWith(p))) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Routes publiques uniquement (login) → rediriger vers /dashboard si déjà connecté
  if (PUBLIC_ONLY.includes(pathname) && token) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
