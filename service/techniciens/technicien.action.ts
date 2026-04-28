'use server';

import { BASE_URL } from "@/baseurl/baseurl";
import { createTechnicienSchema, CreateTechnicienSchema } from "./technicien.schema";
import { ITechnicien, TechnicienStats } from "./types/technicien.type";
import { getAuthToken } from '@/service/auth/auth.action';

const origine: string = "Actions Technicien";

const TechnicienApi = {
  create: { method: "POST", endpoint: () => `${BASE_URL}/technicien` },
  getAll: { method: "GET", endpoint: () => `${BASE_URL}/technicien` },
  getById: { method: "GET", endpoint: (id: string) => `${BASE_URL}/technicien/${id}` },
update: { method: "PATCH", endpoint: (id: string) => `${BASE_URL}/technicien/${id}` },

  delete: { method: "DELETE", endpoint: (id: string) => `${BASE_URL}/technicien/${id}` },
  getTechnicienStats: { method: "GET", endpoint: () => `${BASE_URL}/technicien/statistics` },
};


// Normalise any backend error (string | string[] | NestJS object) to a display string
function normalizeError(raw: unknown, fallback: string): string {
  if (typeof raw === 'string') return raw || fallback;
  if (Array.isArray(raw)) return raw.map(String).join(', ');
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if ('message' in obj) return normalizeError(obj.message, fallback);
  }
  return fallback;
}

// Fonction générique pour gérer les fetch JSON
async function fetchJson<T>(url: string, options: RequestInit): Promise<
  { success: true; data: T } | { success: false; error: string }
> {
  try {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
      ...((options.headers as Record<string, string>) ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const response = await fetch(url, { ...options, headers, cache: 'no-store' });

    if (!response.ok) {
      const errorData: { message?: unknown } | null = await response.json().catch(() => null);
      return {
        success: false,
        error: normalizeError(errorData?.message, `Erreur côté serveur, origine: ${origine}`),
      };
    }

    const data: T = await response.json();
    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : typeof error === 'string' ? error : 'Erreur inconnue';
    return {
      success: false,
      error: message || `Erreur inattendue dans ${origine}`,
    };
  }
}


// CREATE TECHNICIEN
export async function createTechnicien(formData: FormData) {
  const raw = {
    nom: formData.get('nom') as string,
    prenom: formData.get('prenom') as string,
    email: formData.get('email') as string,
    telephone: formData.get('telephone') as string,
    statut: (formData.get('statut') as string) || 'ACTIF',
    specialite: formData.get('specialite') as string,
  };

  const parsed = createTechnicienSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(', '),
    };
  }

  try {
    const token = await getAuthToken();
    const body = new FormData();
    body.append('nom', parsed.data.nom);
    body.append('prenom', parsed.data.prenom);
    body.append('email', parsed.data.email);
    body.append('telephone', parsed.data.telephone);
    body.append('statut', parsed.data.statut);
    body.append('specialite', parsed.data.specialite);
    const siteId = formData.get('siteId');
    if (siteId) body.append('siteId', siteId as string);
    const photoFile = formData.get('photo');
    if (photoFile instanceof Blob && photoFile.size > 0) {
      const filename = photoFile instanceof File ? (photoFile.name || 'photo.jpg') : 'photo.jpg';
      body.append('photo', new File([photoFile], filename, { type: photoFile.type || 'image/jpeg' }));
    }
    const res = await fetch(TechnicienApi.create.endpoint(), {
      method: TechnicienApi.create.method,
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body,
      cache: 'no-store',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null) as { message?: unknown } | null;
      return { success: false, error: normalizeError(err?.message, `Erreur ${res.status}`) };
    }
    const data: ITechnicien = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Erreur réseau' };
  }
}


// GET ALL TECHNICIENS
export async function getAllTechniciens() {
  return fetchJson<ITechnicien[]>(TechnicienApi.getAll.endpoint(), { 
    method: TechnicienApi.getAll.method 
  });
}

// GET TECHNICIEN BY ID
export async function getTechnicienById(id: string) {
  return fetchJson(TechnicienApi.getById.endpoint(id), { method: TechnicienApi.getById.method });
}

// UPDATE TECHNICIEN
export async function updateTechnicien(id: string, formData: FormData) {
  try {
    const token = await getAuthToken();
    const body = new FormData();
    const fields = ['nom', 'prenom', 'email', 'telephone', 'statut', 'specialite'];
    for (const f of fields) {
      const val = formData.get(f);
      if (val) body.append(f, val as string);
    }
    const photoFile = formData.get('photo');
    if (photoFile instanceof Blob && photoFile.size > 0) {
      const filename = photoFile instanceof File ? (photoFile.name || 'photo.jpg') : 'photo.jpg';
      body.append('photo', new File([photoFile], filename, { type: photoFile.type || 'image/jpeg' }));
    }
    const res = await fetch(TechnicienApi.update.endpoint(id), {
      method: TechnicienApi.update.method,
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body,
      cache: 'no-store',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null) as { message?: unknown } | null;
      return { success: false, error: normalizeError(err?.message, `Erreur ${res.status}`) };
    }
    const data: ITechnicien = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Erreur réseau' };
  }
}


// DELETE TECHNICIEN
export async function deleteTechnicien(id: string) {
  return fetchJson(TechnicienApi.delete.endpoint(id), { method: TechnicienApi.delete.method });
}

// GET TECHNICIEN STATS
export async function getTechnicienStats(): Promise<{ success: boolean; data?: TechnicienStats; error?: string }> {
  return fetchJson<TechnicienStats>(TechnicienApi.getTechnicienStats.endpoint(), {
    method: TechnicienApi.getTechnicienStats.method,
  });
}
