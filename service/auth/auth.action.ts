'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { BASE_URL } from '@/baseurl/baseurl';
import {
  IAdminAuthResponse, IAdminRapport, IAdminResponsable, IAdminSite,
  IAuthResponse, IInterventionMe, IProfileResponse,
  IRapportMe, ISiteStats, ITechnicienMe, IVehiculeMe,
} from './types/auth.type';

const TOKEN_COOKIE = 'auth_token';
const ADMIN_TOKEN_COOKIE = 'admin_token';

function normalizeError(raw: unknown, fallback: string): string {
  if (typeof raw === 'string') return raw || fallback;
  if (Array.isArray(raw)) return raw.map(String).join(', ');
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if ('message' in obj) return normalizeError(obj.message, fallback);
  }
  return fallback;
}

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
      const err = await res.json().catch(() => null) as { message?: unknown } | null;
      return { success: false, error: normalizeError(err?.message, `Erreur ${res.status}`) };
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

// ─── Login Admin ──────────────────────────────────────────────────────────────
export async function loginAdmin(email: string, password: string) {
  const result = await authFetch<IAdminAuthResponse>('/auth/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (!result.success) return result;

  const store = await cookies();
  store.set(ADMIN_TOKEN_COOKIE, result.data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return { success: true as const, data: result.data };
}

// ─── Logout Admin ─────────────────────────────────────────────────────────────
export async function logoutAdmin() {
  const store = await cookies();
  store.delete(ADMIN_TOKEN_COOKIE);
  redirect('/admin/login');
}

// ─── Token Admin ─────────────────────────────────────────────────────────────
export async function getAdminToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ADMIN_TOKEN_COOKIE)?.value ?? null;
}

// ─── Auth fetch avec token Admin ─────────────────────────────────────────────
async function adminFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const token = await getAdminToken();
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null) as { message?: unknown } | null;
      return { success: false, error: normalizeError(err?.message, `Erreur ${res.status}`) };
    }
    const data: T = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Erreur réseau' };
  }
}

// ─── Véhicules du site du responsable ────────────────────────────────────────
export async function getMyVehicules() {
  return authFetch<IVehiculeMe[]>('/auth/me/vehicules');
}

// ─── Techniciens du site (avec interventions du jour) ────────────────────────
export async function getMyTechniciens() {
  return authFetch<ITechnicienMe[]>('/auth/me/techniciens');
}

// ─── Interventions du site ────────────────────────────────────────────────────
export async function getMyInterventions(date?: string) {
  const qs = date ? `?date=${date}` : '';
  return authFetch<IInterventionMe[]>(`/auth/me/interventions${qs}`);
}

// ─── Rapports du site ─────────────────────────────────────────────────────────
export async function getMyRapports() {
  return authFetch<IRapportMe[]>('/auth/me/rapports');
}

// ─── Admin: tous les sites ────────────────────────────────────────────────────
export async function adminGetSites() {
  return adminFetch<IAdminSite[]>('/admin/sites');
}

// ─── Admin: rapports d'un site ────────────────────────────────────────────────
export async function adminGetSiteRapports(siteId: string, date?: string) {
  const qs = date ? `?date=${date}` : '';
  return adminFetch<IAdminRapport[]>(`/admin/sites/${siteId}/rapports${qs}`);
}

// ─── Admin: détail d'un rapport ───────────────────────────────────────────────
export async function adminGetRapport(id: string) {
  return adminFetch<IAdminRapport>(`/admin/rapports/${id}`);
}

// ─── Admin: liste des responsables ───────────────────────────────────────────
export async function adminGetResponsables() {
  return adminFetch<IAdminResponsable[]>('/admin/responsables');
}

// ─── Admin: créer un responsable ─────────────────────────────────────────────
export async function adminCreateResponsable(data: {
  nom: string; prenom: string; email: string; password: string;
  telephone?: string; siteId: string;
}) {
  return adminFetch<IAdminResponsable>('/admin/responsables', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
