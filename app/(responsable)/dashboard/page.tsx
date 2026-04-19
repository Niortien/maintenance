import { redirect } from 'next/navigation';
import { getProfile, getSiteStats } from '@/service/auth/auth.action';
import { logout } from '@/service/auth/auth.action';

export const metadata = { title: 'Mon Site — SATE Maintenance' };

// ─── Carte stat ───────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  couleur,
}: {
  label: string;
  value: number;
  couleur: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold" style={{ color: couleur }}>
        {value}
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const [profileRes, statsRes] = await Promise.all([getProfile(), getSiteStats()]);

  if (!profileRes.success) redirect('/login');

  const responsable = profileRes.data;
  const couleur = responsable.site.couleur ?? '#10b981';
  const stats = statsRes.success ? statsRes.data : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* En-tête */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bonjour, {responsable.prenom} 👋
          </h1>
          <p className="text-sm text-gray-500">
            Tableau de bord · Site{' '}
            <span className="font-semibold" style={{ color: couleur }}>
              {responsable.site.nom}
            </span>
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 transition"
          >
            Se déconnecter
          </button>
        </form>
      </div>

      {/* Stats */}
      {stats ? (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Statistiques du site
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard label="Véhicules" value={stats.totalVehicules} couleur={couleur} />
            <StatCard label="Actifs" value={stats.vehiculesActifs} couleur={couleur} />
            <StatCard label="En maintenance" value={stats.vehiculesEnMaintenance} couleur={couleur} />
            <StatCard label="Techniciens" value={stats.totalTechniciens} couleur={couleur} />
            <StatCard label="Rapports" value={stats.totalRapports} couleur={couleur} />
          </div>
        </section>
      ) : null}

      {/* Véhicules */}
      {responsable.site.vehicules?.length ? (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Véhicules du site
          </h2>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Nom</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Plaque</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {responsable.site.vehicules.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-800">{v.nom}</td>
                    <td className="px-4 py-3 text-gray-600">{v.numero_de_plaque}</td>
                    <td className="px-4 py-3 text-gray-600">{v.type}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                          v.statut === 'OPERATIONNEL'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {v.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {/* Techniciens */}
      {responsable.site.techniciens?.length ? (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Techniciens du site
          </h2>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Nom</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Spécialité</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {responsable.site.techniciens.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {t.prenom} {t.nom}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{t.specialite}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                          t.statut === 'ACTIF'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {t.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {/* Derniers rapports */}
      {stats?.derniersRapports?.length ? (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Derniers rapports
          </h2>
          <div className="space-y-2">
            {stats.derniersRapports.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {new Date(r.date).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {r.ops} opérationnel{r.ops > 1 ? 's' : ''} · {r.pannes} panne
                    {r.pannes > 1 ? 's' : ''}
                  </p>
                </div>
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: couleur }}
                >
                  {r.total} véhicules
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
