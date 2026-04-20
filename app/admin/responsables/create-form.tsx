'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminCreateResponsable } from '@/service/auth/auth.action';
import { IAdminSite } from '@/service/auth/types/auth.type';

export default function CreateResponsableForm({ sites }: { sites: IAdminSite[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const data = {
      nom:       fd.get('nom') as string,
      prenom:    fd.get('prenom') as string,
      email:     fd.get('email') as string,
      password:  fd.get('password') as string,
      telephone: (fd.get('telephone') as string) || undefined,
      siteId:    fd.get('siteId') as string,
    };

    const res = await adminCreateResponsable(data);
    setLoading(false);

    if (!res.success) {
      setError(typeof res.error === 'string' ? res.error : 'Erreur lors de la création');
      return;
    }

    setSuccess(`Responsable ${res.data.prenom} ${res.data.nom} créé avec succès.`);
    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Prénom */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-400">Prénom *</label>
          <input
            name="prenom"
            required
            placeholder="Eric"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Nom */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-400">Nom *</label>
          <input
            name="nom"
            required
            placeholder="Konan"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-400">Email *</label>
          <input
            name="email"
            type="email"
            required
            placeholder="responsable.site@sate.ci"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Téléphone */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-400">Téléphone</label>
          <input
            name="telephone"
            placeholder="+22507000001"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Mot de passe */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-400">Mot de passe *</label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Min. 6 caractères"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Site */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-400">Site assigné *</label>
          <select
            name="siteId"
            required
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
          >
            <option value="">— Sélectionner un site —</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nom} ({s.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-950 border border-red-800 px-4 py-2.5 text-sm text-red-400">{error}</p>
      )}
      {success && (
        <p className="rounded-lg bg-emerald-950 border border-emerald-800 px-4 py-2.5 text-sm text-emerald-400">{success}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-amber-400 transition disabled:opacity-60"
      >
        {loading ? 'Création en cours...' : 'Créer le responsable'}
      </button>
    </form>
  );
}
