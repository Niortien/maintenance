import { redirect } from 'next/navigation';
import { adminGetResponsables, adminGetSites } from '@/service/auth/auth.action';
import CreateResponsableForm from './create-form';

export const metadata = { title: 'Responsables — Admin SATE' };

export default async function AdminResponsablesPage() {
  const [responsablesRes, sitesRes] = await Promise.all([
    adminGetResponsables(),
    adminGetSites(),
  ]);

  if (!responsablesRes.success) redirect('/admin/login');

  const responsables = responsablesRes.data;
  const sites = sitesRes.success ? sitesRes.data : [];

  // Sites sans responsable encore assigné
  const assignedSiteIds = new Set(responsables.map((r) => r.site.id));
  const availableSites = sites.filter((s) => !assignedSiteIds.has(s.id));

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-10">

        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <a href="/admin" className="text-xs text-gray-500 hover:text-gray-300 transition">
              ← Tableau de bord
            </a>
            <h1 className="mt-2 text-2xl font-bold text-white">Responsables de site</h1>
            <p className="mt-0.5 text-sm text-gray-400">Gérer les accès responsables</p>
          </div>
        </div>

        {/* Formulaire de création */}
        <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-5 text-base font-semibold text-white">Créer un nouveau responsable</h2>
          {availableSites.length === 0 ? (
            <p className="text-sm text-amber-400">
              Tous les sites ont déjà un responsable assigné.
            </p>
          ) : (
            <CreateResponsableForm sites={availableSites} />
          )}
        </section>

        {/* Liste existants */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Responsables existants · {responsables.length}
          </h2>
          {responsables.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun responsable enregistré.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
              <table className="min-w-full divide-y divide-gray-800 text-sm">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Nom</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Téléphone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Site</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Créé le</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {responsables.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-800/40 transition">
                      <td className="px-4 py-3 font-medium text-white">
                        {r.prenom} {r.nom}
                      </td>
                      <td className="px-4 py-3 text-gray-300">{r.email}</td>
                      <td className="px-4 py-3 text-gray-400">{r.telephone ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                          style={{ backgroundColor: r.site.couleur ?? '#6b7280' }}
                        >
                          {r.site.nom}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(r.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
