'use server';

import { BASE_URL } from '@/baseurl/baseurl';
import { ISite, ISiteDashboard } from './types/site.type';
import { CreateSiteSchema, createSiteSchema } from './site.schema';

const origine = 'Actions Site';

const SiteApi = {
  create: { method: 'POST', endpoint: () => `${BASE_URL}/sites` },
  getAll: { method: 'GET', endpoint: () => `${BASE_URL}/sites` },
  getById: { method: 'GET', endpoint: (id: string) => `${BASE_URL}/sites/${id}` },
  getDashboard: { method: 'GET', endpoint: (id: string) => `${BASE_URL}/sites/${id}/dashboard` },
  update: { method: 'PATCH', endpoint: (id: string) => `${BASE_URL}/sites/${id}` },
  delete: { method: 'DELETE', endpoint: (id: string) => `${BASE_URL}/sites/${id}` },
};

async function fetchJson<T>(
  url: string,
  options: RequestInit
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const response = await fetch(url, { ...options, cache: 'no-store' });
    if (!response.ok) {
      const errorData: { message?: string } | null = await response.json().catch(() => null);
      return { success: false, error: errorData?.message || `Erreur côté serveur, origine: ${origine}` };
    }
    const data: T = await response.json();
    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : typeof error === 'string' ? error : 'Erreur inconnue';
    return { success: false, error: message };
  }
}

export async function createSite(body: CreateSiteSchema) {
  const parsed = createSiteSchema.safeParse(body);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues.map((i) => i.message).join(', ') };
  }
  return fetchJson<ISite>(SiteApi.create.endpoint(), {
    method: SiteApi.create.method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed.data),
  });
}

export async function getAllSites() {
  return fetchJson<ISite[]>(SiteApi.getAll.endpoint(), { method: SiteApi.getAll.method });
}

export async function getSiteById(id: string) {
  return fetchJson<ISite>(SiteApi.getById.endpoint(id), { method: SiteApi.getById.method });
}

export async function getSiteDashboard(id: string) {
  return fetchJson<ISiteDashboard>(SiteApi.getDashboard.endpoint(id), { method: SiteApi.getDashboard.method });
}

export async function updateSite(id: string, body: Partial<CreateSiteSchema>) {
  return fetchJson<ISite>(SiteApi.update.endpoint(id), {
    method: SiteApi.update.method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function deleteSite(id: string) {
  return fetchJson<ISite>(SiteApi.delete.endpoint(id), { method: SiteApi.delete.method });
}
