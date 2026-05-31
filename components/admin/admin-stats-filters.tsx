'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { IAdminSite } from '@/service/auth/types/auth.type';

export function AdminStatsFilters({ sites }: { sites: IAdminSite[] }) {
  const router   = useRouter();
  const pathname = usePathname();
  const params   = useSearchParams();

  const siteId    = params.get('siteId')    ?? '';
  const dateDebut = params.get('dateDebut') ?? '';
  const dateFin   = params.get('dateFin')   ?? '';

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.push(`${pathname}?${next.toString()}`);
    },
    [params, pathname, router],
  );

  const reset = () => router.push(pathname);

  const hasFilter = siteId || dateDebut || dateFin;

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-800 bg-gray-900 p-4">
      {/* Site */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">Site</label>
        <select
          value={siteId}
          onChange={(e) => update('siteId', e.target.value)}
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
        >
          <option value="">Tous les sites</option>
          {sites.map((s) => (
            <option key={s.id} value={s.id}>{s.nom}</option>
          ))}
        </select>
      </div>

      {/* Date début */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">Du</label>
        <input
          type="date"
          value={dateDebut}
          onChange={(e) => update('dateDebut', e.target.value)}
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none scheme-dark"
        />
      </div>

      {/* Date fin */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500">Au</label>
        <input
          type="date"
          value={dateFin}
          onChange={(e) => update('dateFin', e.target.value)}
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none scheme-dark"
        />
      </div>

      {/* Reset */}
      {hasFilter && (
        <button
          onClick={reset}
          className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-400 hover:border-gray-500 hover:text-white transition"
        >
          Réinitialiser
        </button>
      )}

      {/* Indicateur de filtres actifs */}
      {hasFilter && (
        <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
          Filtre actif
        </span>
      )}
    </div>
  );
}
