import { NextRequest, NextResponse } from 'next/server';

const PROTECTED = ['/dashboard'];
const ADMIN_PROTECTED = ['/admin'];
const PUBLIC_ONLY = ['/login'];
const ADMIN_PUBLIC_ONLY = ['/admin/login'];
const TOKEN_COOKIE = 'auth_token';
const ADMIN_TOKEN_COOKIE = 'admin_token';

export function middleware(req: NextRequest) {
  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  const adminToken = req.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
  const { pathname } = req.nextUrl;

  // Routes admin protégées → rediriger vers /admin/login
  if (ADMIN_PROTECTED.some((p) => pathname.startsWith(p)) && !ADMIN_PUBLIC_ONLY.includes(pathname)) {
    if (!adminToken) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Page /admin/login → rediriger vers /admin si déjà connecté
  if (ADMIN_PUBLIC_ONLY.includes(pathname) && adminToken) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  // Routes responsable protégées → rediriger vers /login
  if (PROTECTED.some((p) => pathname.startsWith(p))) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Page /login → rediriger vers /dashboard si déjà connecté
  if (PUBLIC_ONLY.includes(pathname) && token) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/admin/:path*', '/admin/login'],
};
