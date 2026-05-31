'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { setGoogleToken } from '@/service/auth/auth.action';

function decodeJwtRole(token: string): string | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return (decoded.role as string) ?? null;
  } catch {
    return null;
  }
}

export function GoogleCallbackClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      router.replace('/login?error=google_failed');
      return;
    }

    const role = decodeJwtRole(token);
    const isAdmin = role === 'ADMIN';

    setGoogleToken(token, isAdmin).then(() => {
      router.replace(isAdmin ? '/admin' : '/dashboard');
    });
  }, [searchParams, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-emerald-950 gap-3">
      <svg
        className="h-8 w-8 animate-spin text-emerald-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <p className="text-sm text-emerald-400">Finalisation de la connexion…</p>
    </main>
  );
}
