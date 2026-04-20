'use server';

import { cookies } from 'next/headers';
import { BASE_URL } from '@/baseurl/baseurl';
import { IEquipement, IEquipementStats } from './types/equipement.type';
import { createEquipementSchema } from './equipement.schema';

const TOKEN_COOKIE = 'auth_token';

async function getToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(TOKEN_COOKIE)?.value ?? null;
}

type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ─── GET all equipements du site du responsable ───────────────────────────────
export async function getMyEquipements(): Promise<ApiResult<IEquipement[]>> {
  try {
    const token = await getToken();
    const res = await fetch(`${BASE_URL}/equipement`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null) as { message?: string } | null;
      return { success: false, error: err?.message ?? `Erreur ${res.status}` };
    }
    const data: IEquipement[] = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Erreur réseau' };
  }
}

// ─── GET stats ─────────────────────────────────────────────────────────────────
export async function getEquipementStats(): Promise<ApiResult<IEquipementStats>> {
  try {
    const token = await getToken();
    const res = await fetch(`${BASE_URL}/equipement/stats`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null) as { message?: string } | null;
      return { success: false, error: err?.message ?? `Erreur ${res.status}` };
    }
    const data: IEquipementStats = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Erreur réseau' };
  }
}

// ─── CREATE equipement (multipart/form-data) ──────────────────────────────────
export async function createEquipement(
  formData: FormData,
): Promise<ApiResult<IEquipement>> {
  // Validate text fields with Zod before sending
  const raw = {
    nom: formData.get('nom') as string,
    categorie: formData.get('categorie') as string,
    immatriculation: (formData.get('immatriculation') as string) || undefined,
    statut: (formData.get('statut') as string) || 'ACTIF',
  };

  const parsed = createEquipementSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(', '),
    };
  }

  try {
    const token = await getToken();
    // Rebuild FormData to ensure only valid fields are sent
    const body = new FormData();
    body.append('nom', parsed.data.nom);
    body.append('categorie', parsed.data.categorie);
    body.append('statut', parsed.data.statut);
    if (parsed.data.immatriculation) body.append('immatriculation', parsed.data.immatriculation);
    const imageFile = formData.get('image');
    if (imageFile instanceof Blob && imageFile.size > 0) {
      const filename = imageFile instanceof File ? (imageFile.name || 'image.jpg') : 'image.jpg';
      const type = imageFile.type || 'image/jpeg';
      body.append('image', new File([imageFile], filename, { type }));
    }

    const res = await fetch(`${BASE_URL}/equipement`, {
      method: 'POST',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null) as { message?: string } | null;
      return { success: false, error: err?.message ?? `Erreur ${res.status}` };
    }
    const data: IEquipement = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Erreur réseau' };
  }
}

// ─── UPDATE equipement ─────────────────────────────────────────────────────────
export async function updateEquipement(
  id: string,
  formData: FormData,
): Promise<ApiResult<IEquipement>> {
  try {
    const token = await getToken();
    const body = new FormData();
    const nom = formData.get('nom');
    const categorie = formData.get('categorie');
    const immatriculation = formData.get('immatriculation');
    const statut = formData.get('statut');
    const imageFile = formData.get('image');

    if (nom) body.append('nom', nom as string);
    if (categorie) body.append('categorie', categorie as string);
    if (immatriculation) body.append('immatriculation', immatriculation as string);
    if (statut) body.append('statut', statut as string);
    if (imageFile instanceof Blob && imageFile.size > 0) {
      const filename = imageFile instanceof File ? (imageFile.name || 'image.jpg') : 'image.jpg';
      const type = imageFile.type || 'image/jpeg';
      body.append('image', new File([imageFile], filename, { type }));
    }

    const res = await fetch(`${BASE_URL}/equipement/${id}`, {
      method: 'PATCH',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null) as { message?: string } | null;
      return { success: false, error: err?.message ?? `Erreur ${res.status}` };
    }
    const data: IEquipement = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Erreur réseau' };
  }
}

// ─── DELETE equipement ─────────────────────────────────────────────────────────
export async function deleteEquipement(id: string): Promise<ApiResult<IEquipement>> {
  try {
    const token = await getToken();
    const res = await fetch(`${BASE_URL}/equipement/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null) as { message?: string } | null;
      return { success: false, error: err?.message ?? `Erreur ${res.status}` };
    }
    const data: IEquipement = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Erreur réseau' };
  }
}
