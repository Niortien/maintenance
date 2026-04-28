'use server';

import { cookies } from 'next/headers';
import { BASE_URL } from '@/baseurl/baseurl';
import { INotification, INotificationCount } from './types/notification.type';

const ADMIN_TOKEN_COOKIE = 'admin_token';

async function getAdminToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ADMIN_TOKEN_COOKIE)?.value ?? null;
}

type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ─── GET all notifications ────────────────────────────────────────────────────
export async function adminGetNotifications(): Promise<ApiResult<INotification[]>> {
  try {
    const token = await getAdminToken();
    const res = await fetch(`${BASE_URL}/admin/notifications`, {
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
    const data: INotification[] = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Erreur réseau' };
  }
}

// ─── GET unread notifications ─────────────────────────────────────────────────
export async function adminGetUnreadNotifications(): Promise<ApiResult<INotification[]>> {
  try {
    const token = await getAdminToken();
    const res = await fetch(`${BASE_URL}/admin/notifications/unread`, {
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
    const data: INotification[] = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Erreur réseau' };
  }
}

// ─── GET unread count ─────────────────────────────────────────────────────────
export async function adminGetNotificationCount(): Promise<ApiResult<INotificationCount>> {
  try {
    const token = await getAdminToken();
    const res = await fetch(`${BASE_URL}/admin/notifications/count`, {
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
    const data: INotificationCount = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Erreur réseau' };
  }
}

// ─── MARK one as read ─────────────────────────────────────────────────────────
export async function adminMarkNotificationRead(id: string): Promise<ApiResult<INotification>> {
  try {
    const token = await getAdminToken();
    const res = await fetch(`${BASE_URL}/admin/notifications/${id}/read`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null) as { message?: string } | null;
      return { success: false, error: err?.message ?? `Erreur ${res.status}` };
    }
    const data: INotification = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Erreur réseau' };
  }
}

// ─── MARK all as read ─────────────────────────────────────────────────────────
export async function adminMarkAllNotificationsRead(): Promise<ApiResult<{ count: number }>> {
  try {
    const token = await getAdminToken();
    const res = await fetch(`${BASE_URL}/admin/notifications/read-all`, {
      method: 'PATCH',
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
