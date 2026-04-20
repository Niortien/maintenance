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
      const errorData: { message?: string } | null = await response.json().catch(() => null);
      return {
        success: false,
        error: errorData?.message || `Erreur côté serveur, origine: ${origine}`,
      };
    }

    const data: T = await response.json();
    return { success: true, data };
  } catch (error: unknown) {
    let message = "Erreur inconnue";
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    }

    return {
      success: false,
      error: message || `Erreur inattendue dans ${origine}`,
    };
  }
}


// CREATE TECHNICIEN
export async function createTechnicien(body: CreateTechnicienSchema) {
  const parsed = createTechnicienSchema.safeParse(body);
  if (!parsed.success) {
    return { 
      success: false, 
      error: parsed.error.issues.map(issue => issue.message).join(", ") 
    };
  }

  return fetchJson(TechnicienApi.create.endpoint(), {
    method: TechnicienApi.create.method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });
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
export async function updateTechnicien(id: string, body: CreateTechnicienSchema) {
  const parsed = createTechnicienSchema.safeParse(body);
  if (!parsed.success) {
    return { 
      success: false, 
      error: parsed.error.issues.map(issue => issue.message).join(", ") 
    };
  }

  return fetchJson(TechnicienApi.update.endpoint(id), {
    method: TechnicienApi.update.method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });
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
