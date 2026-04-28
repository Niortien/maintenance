'use server';

import { cookies } from 'next/headers';
import { BASE_URL } from '@/baseurl/baseurl';
import { ISituation, StatutSituation } from './types/situation.type';
import { createSituationSchema } from './situation.schema';

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

type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ─── GET all situations du site ───────────────────────────────────────────────
export async function getMySituations(): Promise<ApiResult<ISituation[]>> {
  try {
    const token = await getToken();
    const res = await fetch(`${BASE_URL}/situation`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('[getMySituations] HTTP', res.status, body);
      let msg: string;
      try { msg = (JSON.parse(body) as { message?: string }).message ?? `Erreur ${res.status}`; }
      catch { msg = `Erreur ${res.status}`; }
      return { success: false, error: msg };
    }
    const data: ISituation[] = await res.json();
    return { success: true, data };
  } catch (e) {
    console.error('[getMySituations] fetch error', e);
    return { success: false, error: e instanceof Error ? e.message : 'Erreur réseau' };
  }
}

// ─── GET one situation ────────────────────────────────────────────────────────
export async function getSituation(id: string): Promise<ApiResult<ISituation>> {
  try {
    const token = await getToken();
    const res = await fetch(`${BASE_URL}/situation/${id}`, {
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
    const data: ISituation = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Erreur réseau' };
  }
}

// ─── CREATE situation (multipart/form-data) ───────────────────────────────────
export async function createSituation(
  formData: FormData,
): Promise<ApiResult<ISituation>> {
  const raw = {
    equipementId: formData.get('equipementId') as string,
    description: formData.get('description') as string,
  };

  const parsed = createSituationSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(', '),
    };
  }

  // Le champ 'image' est répété autant de fois qu'il y a de fichiers
  const imageFiles = formData.getAll('image');
  const allImages = imageFiles.filter((f): f is File =>
    typeof f !== 'string' && typeof (f as File).size === 'number' && (f as File).size > 0
  );

  if (allImages.length === 0) {
    return { success: false, error: 'Au moins une image est obligatoire' };
  }

  try {
    const token = await getToken();
    const body = new FormData();
    body.append('equipementId', parsed.data.equipementId);
    body.append('description', parsed.data.description);

    const besoinsRaw = formData.get('besoinsLogistiques');
    if (besoinsRaw) body.append('besoinsLogistiques', besoinsRaw as string);

    for (const img of allImages) {
      const filename = img instanceof File ? (img.name || 'image.jpg') : 'image.jpg';
      const type = img.type || 'image/jpeg';
      body.append('image', new File([img], filename, { type }));
    }

    const res = await fetch(`${BASE_URL}/situation`, {
      method: 'POST',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null) as { message?: string } | null;
      return { success: false, error: err?.message ?? `Erreur ${res.status}` };
    }
    const data: ISituation = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Erreur réseau' };
  }
}

// ─── UPDATE situation ─────────────────────────────────────────────────────────
export async function updateSituation(
  id: string,
  formData: FormData,
): Promise<ApiResult<ISituation>> {
  try {
    const token = await getToken();
    const body = new FormData();

    const description = formData.get('description');
    const besoinsLogistiques = formData.get('besoinsLogistiques');
    const imageFile = formData.get('image');

    if (description) body.append('description', description as string);
    if (besoinsLogistiques) body.append('besoinsLogistiques', besoinsLogistiques as string);
    if (imageFile instanceof Blob && imageFile.size > 0) {
      const filename = imageFile instanceof File ? (imageFile.name || 'image.jpg') : 'image.jpg';
      const type = imageFile.type || 'image/jpeg';
      body.append('image', new File([imageFile], filename, { type }));
    }

    const res = await fetch(`${BASE_URL}/situation/${id}`, {
      method: 'PATCH',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null) as { message?: string } | null;
      return { success: false, error: err?.message ?? `Erreur ${res.status}` };
    }
    const data: ISituation = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Erreur réseau' };
  }
}

// ─── DELETE situation ─────────────────────────────────────────────────────────
export async function deleteSituation(id: string): Promise<ApiResult<ISituation>> {
  try {
    const token = await getToken();
    const res = await fetch(`${BASE_URL}/situation/${id}`, {
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
    const data: ISituation = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Erreur réseau' };
  }
}

// ─── CHANGE statut (responsable: EN_COURS | TERMINEE) ─────────────────────────
export async function changeSituationStatut(
  id: string,
  statut: Extract<StatutSituation, 'EN_COURS' | 'TERMINEE'>,
): Promise<ApiResult<ISituation>> {
  try {
    const token = await getToken();
    const res = await fetch(`${BASE_URL}/situation/${id}/statut`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ statut }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null) as { message?: string } | null;
      return { success: false, error: err?.message ?? `Erreur ${res.status}` };
    }
    const data: ISituation = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Erreur réseau' };
  }
}

// ─── DELETE image (responsable) ───────────────────────────────────────────────
export async function deleteSituationImage(
  situationId: string,
  imageId: string,
): Promise<ApiResult<{ message: string }>> {
  try {
    const token = await getToken();
    const res = await fetch(`${BASE_URL}/situation/${situationId}/images/${imageId}`, {
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
    const data = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Erreur réseau' };
  }
}

// ─── ADMIN: GET all situations ────────────────────────────────────────────────
export async function adminGetSituations(): Promise<ApiResult<ISituation[]>> {
  try {
    const token = await getAdminToken();
    const res = await fetch(`${BASE_URL}/admin/situations`, {
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
    const data: ISituation[] = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Erreur réseau' };
  }
}

// ─── ADMIN: GET one situation ─────────────────────────────────────────────────
export async function adminGetSituation(id: string): Promise<ApiResult<ISituation>> {
  try {
    const token = await getAdminToken();
    const res = await fetch(`${BASE_URL}/admin/situations/${id}`, {
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
    const data: ISituation = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Erreur réseau' };
  }
}

// ─── ADMIN: CHANGE statut (any) ───────────────────────────────────────────────
export async function adminChangeSituationStatut(
  id: string,
  statut: StatutSituation,
): Promise<ApiResult<ISituation>> {
  try {
    const token = await getAdminToken();
    const res = await fetch(`${BASE_URL}/admin/situations/${id}/statut`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ statut }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null) as { message?: string } | null;
      return { success: false, error: err?.message ?? `Erreur ${res.status}` };
    }
    const data: ISituation = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Erreur réseau' };
  }
}
