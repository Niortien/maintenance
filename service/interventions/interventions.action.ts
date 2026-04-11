'use server';

import { BASE_URL } from "@/baseurl/baseurl";
import { createInterventionSchema, CreateInterventionType } from "./interventions.schema";
import { IIntervention, InterventionStats, AllStatistics } from "./types/interventions/intervention.type";

const origine: string = "Actions Intervention";

const InterventionApi = {
  create: { method: "POST", endpoint: () => `${BASE_URL}/intervention` },
  getAll: { method: "GET", endpoint: () => `${BASE_URL}/intervention` },
  getById: { method: "GET", endpoint: (id: string) => `${BASE_URL}/intervention/${id}` },
  update: { method: "PATCH", endpoint: (id: string) => `${BASE_URL}/intervention/${id}` },
  delete: { method: "DELETE", endpoint: (id: string) => `${BASE_URL}/intervention/${id}` },
  getInterventionStats: { method: "GET", endpoint: () => `${BASE_URL}/intervention/statistics` },
  getAllStatistics: { method: "GET", endpoint: () => `${BASE_URL}/statistics` },
};
// Fonction générique pour fetch JSON
async function fetchJson<T>(url: string, options: RequestInit): Promise<
  { success: true; data: T } | { success: false; error: string }
> {
  try {
    const response = await fetch(url, options);

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
    if (error instanceof Error) message = error.message;
    else if (typeof error === "string") message = error;

    return { success: false, error: message || `Erreur inattendue dans ${origine}` };
  }
}

// CREATE INTERVENTION
export async function createIntervention(body: CreateInterventionType) {
  
  const parsed = createInterventionSchema.safeParse(body);
  if (!parsed.success) {
    console.error("Validation error:", parsed.error.issues);
    return {
      success: false,
      error: parsed.error.issues.map(issue => issue.message).join(", "),
    };
  }

  console.log("Sending intervention data:", parsed.data);

  const result = await fetchJson<IIntervention>(InterventionApi.create.endpoint(), {
    method: InterventionApi.create.method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  console.log("API response:", result);
  return result;
}

// GET ALL INTERVENTIONS
export async function getAllInterventions() {
  return fetchJson<IIntervention[]>(InterventionApi.getAll.endpoint(), {
    method: InterventionApi.getAll.method,
  });
}

// GET INTERVENTION BY ID
export async function getInterventionById(id: string) {
  if (!id) return { success: false, error: "ID d'intervention manquant" };
  return fetchJson<IIntervention>(InterventionApi.getById.endpoint(id), {
    method: InterventionApi.getById.method,
  });
}

// UPDATE INTERVENTION (PATCH)
export async function updateIntervention(
  id: string,
  body: Partial<CreateInterventionType>
) {
  if (!id) return { success: false, error: "ID d'intervention manquant" };
  if (!body || Object.keys(body).length === 0) {
    return { success: false, error: "Aucun champ à mettre à jour" };
  }

  // Validation partielle
  const parsed = createInterventionSchema.partial().safeParse(body);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map(issue => issue.message).join(", "),
    };
  }

  return fetchJson<IIntervention>(InterventionApi.update.endpoint(id), {
    method: InterventionApi.update.method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });
}

// DELETE INTERVENTION
export async function deleteIntervention(id: string) {
  if (!id) return { success: false, error: "ID d'intervention manquant" };
  return fetchJson(InterventionApi.delete.endpoint(id), {
    method: InterventionApi.delete.method,
  });
}

// GET INTERVENTION STATS
export async function getInterventionStats(): Promise<{ success: boolean; data?: InterventionStats; error?: string }> {
  return fetchJson<InterventionStats>(InterventionApi.getInterventionStats.endpoint(), {
    method: InterventionApi.getInterventionStats.method,
  });
}

// GET ALL STATISTICS
export async function getAllStatistics(): Promise<{ success: boolean; data?: AllStatistics; error?: string }> {
  return fetchJson<AllStatistics>(InterventionApi.getAllStatistics.endpoint(), {
    method: InterventionApi.getAllStatistics.method,
  });
}
