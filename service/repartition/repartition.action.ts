'use server';

import { cookies } from 'next/headers';
import { BASE_URL } from '@/baseurl/baseurl';
import { createRepartitionSchema, CreateRepartitionSchema } from './repartition.schema';
import { IRepartition, IRepartitionSummary, RepartitionQuery } from './types/repartition.type';

const TOKEN_COOKIE = 'auth_token';
const ADMIN_TOKEN_COOKIE = 'admin_token';

async function getToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(TOKEN_COOKIE)?.value ?? null;
}

async function getAdminToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ADMIN_TOKEN_COOKIE)?.value ?? null;
}

type ApiResult<T> = { success: true; data: T } | { success: false; error: string };

function normalizeError(raw: unknown, fallback: string): string {
  if (typeof raw === 'string') return raw || fallback;
  if (Array.isArray(raw)) return raw.map(String).join(', ');
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if ('message' in obj) return normalizeError(obj.message, fallback);
  }
  return fallback;
}

async function request<T>(
  path: string,
  options: RequestInit,
  token: string | null,
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      cache: 'no-store',
      headers: {
        ...(options.headers as Record<string, string> | undefined),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      let msg: string;
      try {
        msg = normalizeError((JSON.parse(body) as { message?: unknown }).message, `Erreur ${res.status}`);
      } catch {
        msg = `Erreur ${res.status}`;
      }
      return { success: false, error: msg };
    }
    const data: T = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Erreur réseau' };
  }
}

function buildQuery(query?: RepartitionQuery & { siteId?: string }): string {
  if (!query) return '';
  const params = new URLSearchParams();
  if (query.type) params.append('type', query.type);
  if (query.from) params.append('from', query.from);
  if (query.to) params.append('to', query.to);
  if (query.vehiculeId) params.append('vehiculeId', query.vehiculeId);
  if (query.siteId) params.append('siteId', query.siteId);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

// ─── Responsable de site ──────────────────────────────────────────────────────

export async function getMyRepartitions(query?: RepartitionQuery): Promise<ApiResult<IRepartition[]>> {
  const token = await getToken();
  return request<IRepartition[]>(`/repartitions${buildQuery(query)}`, { method: 'GET' }, token);
}

export async function getMyRepartitionsSummary(query?: RepartitionQuery): Promise<ApiResult<IRepartitionSummary>> {
  const token = await getToken();
  return request<IRepartitionSummary>(`/repartitions/summary${buildQuery(query)}`, { method: 'GET' }, token);
}

export async function createRepartition(body: CreateRepartitionSchema): Promise<ApiResult<IRepartition>> {
  const parsed = createRepartitionSchema.safeParse(body);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues.map((i) => i.message).join(', ') };
  }
  const token = await getToken();
  return request<IRepartition>(
    '/repartitions',
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data) },
    token,
  );
}

export async function updateRepartition(
  id: string,
  body: Partial<CreateRepartitionSchema>,
): Promise<ApiResult<IRepartition>> {
  const token = await getToken();
  return request<IRepartition>(
    `/repartitions/${id}`,
    { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
    token,
  );
}

export async function deleteRepartition(id: string): Promise<ApiResult<IRepartition>> {
  const token = await getToken();
  return request<IRepartition>(`/repartitions/${id}`, { method: 'DELETE' }, token);
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function getAllRepartitionsAdmin(
  query?: RepartitionQuery & { siteId?: string },
): Promise<ApiResult<IRepartition[]>> {
  const token = await getAdminToken();
  return request<IRepartition[]>(`/admin/repartitions${buildQuery(query)}`, { method: 'GET' }, token);
}

export async function getRepartitionsSummaryAdmin(
  query?: RepartitionQuery & { siteId?: string },
): Promise<ApiResult<IRepartitionSummary>> {
  const token = await getAdminToken();
  return request<IRepartitionSummary>(`/admin/repartitions/summary${buildQuery(query)}`, { method: 'GET' }, token);
}
