'use server';
import { IVehicule } from './types/vehicule.type';
import { CreateVehiculeSchema, createVehiculeSchema } from './vehicule.schema';



import { BASE_URL } from "@/baseurl/baseurl";



const origine: string = "Actions Vehicule";

const VehiculeApi = {
  create: { method: "POST", endpoint: () => `${BASE_URL}/vehicule` },
  getAll: { method: "GET", endpoint: () => `${BASE_URL}/vehicule` },
  getById: { method: "GET", endpoint: (id: string) => `${BASE_URL}/vehicule/${id}` },
update: { method: "PATCH", endpoint: (id: string) => `${BASE_URL}/vehicule/${id}` },

  delete: { method: "DELETE", endpoint: (id: string) => `${BASE_URL}/vehicule/${id}` },
};

// Fonction générique pour gérer les fetch JSON
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


// CREATE VEHICULE
export async function createVehicule(body: CreateVehiculeSchema) {
  const parsed = createVehiculeSchema.safeParse(body);
  if (!parsed.success) {
    return { 
      success: false, 
      error: parsed.error.issues.map(issue => issue.message).join(", ") 
    };
  }

  return fetchJson(VehiculeApi.create.endpoint(), {
    method: VehiculeApi.create.method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });
}


// GET ALL VEHICULE
export async function getAllVehicule() {
  return fetchJson<IVehicule[]>(VehiculeApi.getAll.endpoint(), { 
    method: VehiculeApi.getAll.method 
  });
}

// GET VEHICULE BY ID
export async function getVehiculeById(id: string) {
  return fetchJson(VehiculeApi.getById.endpoint(id), { method: VehiculeApi.getById.method });
}

// UPDATE VEHICULE
export async function updateVehicule(id: string, body: CreateVehiculeSchema) {
  const parsed = createVehiculeSchema.safeParse(body);
  if (!parsed.success) {
    return { 
      success: false, 
      error: parsed.error.issues.map(issue => issue.message).join(", ") 
    };
  }

  return fetchJson(VehiculeApi.update.endpoint(id), {
    method: VehiculeApi.update.method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });
}


// DELETE TECHNICIEN
export async function deleteVehicule(id: string) {
  return fetchJson(VehiculeApi.delete.endpoint(id), { method: VehiculeApi.delete.method });
}
