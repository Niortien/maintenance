'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { BASE_URL } from '@/baseurl/baseurl';
import { IAuthResponse, IProfileResponse, ISiteStats } from './types/auth.type';

const TOKEN_COOKIE = 'auth_token';

// ─── Helpers ──────────────────────────────────────────────────────────────────
export async function getAuthToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(TOKEN_COOKIE)?.value ?? null;
}

async function authFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null) as { message?: string } | null;
      return { success: false, error: err?.message ?? `Erreur ${res.status}` };
    }
    const data: T = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Erreur réseau' };
  }
}

// ─── Login ────────────────────────────────────────────────────────────────────
export async function login(email: string, password: string) {
  const result = await authFetch<IAuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (!result.success) return result;

  // Stocker le token dans un cookie httpOnly
  const store = await cookies();
  store.set(TOKEN_COOKIE, result.data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    path: '/',
  });

  return { success: true as const, data: result.data };
}

// ─── Logout ───────────────────────────────────────────────────────────────────
export async function logout() {
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
  redirect('/login');
}

// ─── Profil ───────────────────────────────────────────────────────────────────
export async function getProfile() {
  return authFetch<IProfileResponse>('/auth/me');
}

// ─── Stats du site ────────────────────────────────────────────────────────────
export async function getSiteStats() {
  return authFetch<ISiteStats>('/auth/me/stats');
}

// ─── Changement de mot de passe ───────────────────────────────────────────────
export async function changePassword(ancienMotDePasse: string, nouveauMotDePasse: string) {
  return authFetch<{ message: string }>('/auth/me/password', {
    method: 'PATCH',
    body: JSON.stringify({ ancienMotDePasse, nouveauMotDePasse }),
  });
}
