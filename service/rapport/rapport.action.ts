'use server';

import { BASE_URL } from '@/baseurl/baseurl';
import { CreateLigneRapportSchema, CreateRapportSchema, createRapportSchema } from './rapport.schema';
import { IRapport, ILigneRapport, RapportRecap, RapportStats } from './types/rapport.type';
import { getAuthToken } from '@/service/auth/auth.action';

const origine = 'Actions Rapport';

const RapportApi = {
  create: { method: 'POST', endpoint: () => `${BASE_URL}/rapports` },
  getAll: { method: 'GET', endpoint: (siteId?: string, date?: string) => {
    const params = new URLSearchParams();
    if (siteId) params.append('siteId', siteId);
    if (date) params.append('date', date);
    const query = params.toString();
    return `${BASE_URL}/rapports${query ? `?${query}` : ''}`;
  }},
  getById: { method: 'GET', endpoint: (id: string) => `${BASE_URL}/rapports/${id}` },
  getRecap: { method: 'GET', endpoint: (id: string) => `${BASE_URL}/rapports/${id}/recap` },
  update: { method: 'PATCH', endpoint: (id: string) => `${BASE_URL}/rapports/${id}` },
  delete: { method: 'DELETE', endpoint: (id: string) => `${BASE_URL}/rapports/${id}` },
  getStatistics: { method: 'GET', endpoint: () => `${BASE_URL}/rapports/statistics` },
  addLigne: { method: 'POST', endpoint: (rapportId: string) => `${BASE_URL}/rapports/${rapportId}/lignes` },
  updateLigne: { method: 'PATCH', endpoint: (ligneId: string) => `${BASE_URL}/rapports/lignes/${ligneId}` },
  deleteLigne: { method: 'DELETE', endpoint: (ligneId: string) => `${BASE_URL}/rapports/lignes/${ligneId}` },
};

async function fetchJson<T>(
  url: string,
  options: RequestInit
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const response = await fetch(url, { ...options, headers, cache: 'no-store' });
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

export async function createRapport(body: CreateRapportSchema) {
  const parsed = createRapportSchema.safeParse(body);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues.map((i) => i.message).join(', ') };
  }
  return fetchJson<IRapport>(RapportApi.create.endpoint(), {
    method: RapportApi.create.method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed.data),
  });
}

export async function getAllRapports(siteId?: string, date?: string) {
  return fetchJson<IRapport[]>(RapportApi.getAll.endpoint(siteId, date), { method: RapportApi.getAll.method });
}

export async function getRapportById(id: string) {
  return fetchJson<IRapport>(RapportApi.getById.endpoint(id), { method: RapportApi.getById.method });
}

export async function getRapportRecap(id: string) {
  return fetchJson<RapportRecap>(RapportApi.getRecap.endpoint(id), { method: RapportApi.getRecap.method });
}

export async function updateRapport(id: string, body: Partial<CreateRapportSchema>) {
  return fetchJson<IRapport>(RapportApi.update.endpoint(id), {
    method: RapportApi.update.method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function deleteRapport(id: string) {
  return fetchJson<IRapport>(RapportApi.delete.endpoint(id), { method: RapportApi.delete.method });
}

export async function getRapportStatistics() {
  return fetchJson<RapportStats>(RapportApi.getStatistics.endpoint(), { method: RapportApi.getStatistics.method });
}

export async function addLigneToRapport(rapportId: string, body: CreateLigneRapportSchema) {
  return fetchJson<ILigneRapport>(RapportApi.addLigne.endpoint(rapportId), {
    method: RapportApi.addLigne.method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function updateLigneRapport(ligneId: string, body: Partial<CreateLigneRapportSchema>) {
  return fetchJson<ILigneRapport>(RapportApi.updateLigne.endpoint(ligneId), {
    method: RapportApi.updateLigne.method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function deleteLigneRapport(ligneId: string) {
  return fetchJson<ILigneRapport>(RapportApi.deleteLigne.endpoint(ligneId), { method: RapportApi.deleteLigne.method });
}
