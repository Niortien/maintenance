import { redirect } from 'next/navigation';
import { getProfile, getSiteStats, getMyVehicules, getMyTechniciens, getMyInterventions } from '@/service/auth/auth.action';
import { logout } from '@/service/auth/auth.action';
import { IVehiculeMe, ITechnicienMe, IInterventionMe } from '@/service/auth/types/auth.type';
import Link from 'next/link';

export const metadata = { title: 'Mon Site — SATE Maintenance' };

// ─── Helpers ──────────────────────────────────────────────────────────────────
const SPECIALITE_LABELS: Record<string, string> = {
  MECANIQUE_GENERALE: 'Mécanique générale',
  ELECTRICITE_AUTOMOBILE: 'Électricité auto',
  PNEUMATIQUE: 'Pneumatique',
  DIAGNOSTIC_ELECTRONIQUE: 'Diagnostic élec.',
  SYSTEME_FREINAGE: 'Système freinage',
  CLIMATISATION: 'Climatisation',
  TRANSMISSION: 'Transmission',
  HYDRAULIQUE: 'Hydraulique',
  CARROSSERIE: 'Carrosserie',
  PEINTURE: 'Peinture',
};

const STATUT_INT_STYLE: Record<string, string> = {
  EN_ATTENTE: 'bg-gray-100 text-gray-600',
  EN_COURS:   'bg-blue-100 text-blue-700',
  TERMINE:    'bg-emerald-100 text-emerald-700',
  ANNULE:     'bg-red-100 text-red-600',
};

// ─── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, couleur, sub }: { label: string; value: number; couleur: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 text-3xl font-bold" style={{ color: couleur }}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

// ─── Véhicules section ─────────────────────────────────────────────────────────
function VehiculeSection({ vehicules }: { vehicules: IVehiculeMe[]; couleur: string }) {
  const actifs   = vehicules.filter((v) => v.statut === 'ACTIF');
  const enMaint  = vehicules.filter((v) => v.statut === 'EN_MAINTENANCE');
  const inactifs = vehicules.filter((v) => v.statut === 'INACTIF');

  const groups = [
    { label: 'Disponibles',    items: actifs,   colorClass: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: '#10b981' },
    { label: 'En maintenance', items: enMaint,  colorClass: 'bg-amber-100 text-amber-700 border-amber-200',       dot: '#f59e0b' },
    { label: 'Inactifs',       items: inactifs, colorClass: 'bg-gray-100 text-gray-500 border-gray-200',          dot: '#9ca3af' },
  ].filter((g) => g.items.length > 0);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Équipements & Véhicules</h2>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400" />{actifs.length} disponible{actifs.length > 1 ? 's' : ''}</span>
          {enMaint.length > 0 && <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" />{enMaint.length} en maint.</span>}
        </div>
      </div>

      <div className="space-y-5">
        {groups.map(({ label, items, colorClass, dot }) => (
          <div key={label}>
            <p className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: dot }} />
              {label} · {items.length}
            </p>
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-gray-50 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400">Nom</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400">Plaque</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400">Modèle</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400">Type</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50/60 transition">
                      <td className="px-4 py-2.5 font-medium text-gray-800">{v.nom}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-500">{v.numero_de_plaque}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-500">{v.modele}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-500">{v.type}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${colorClass}`}>
                          {v.statut === 'ACTIF' ? 'Disponible' : v.statut === 'EN_MAINTENANCE' ? 'En maintenance' : 'Inactif'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Techniciens section ───────────────────────────────────────────────────────
function TechnicienSection({ techniciens, couleur }: { techniciens: ITechnicienMe[]; couleur: string }) {
  const actifs = techniciens.filter((t) => t.statut === 'ACTIF');

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Techniciens en activité</h2>
        <span className="text-xs text-gray-400">{actifs.length} actif{actifs.length > 1 ? 's' : ''}</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {actifs.map((t) => (
          <div key={t.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-800">{t.prenom} {t.nom}</p>
                <p className="text-xs text-gray-400 mt-0.5">{SPECIALITE_LABELS[t.specialite] ?? t.specialite}</p>
              </div>
              {t.interventions.length > 0 ? (
                <span className="rounded-full px-2 py-0.5 text-xs font-semibold text-white" style={{ backgroundColor: couleur }}>
                  {t.interventions.length} interv.
                </span>
              ) : (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-400">Disponible</span>
              )}
            </div>

            {t.interventions.length > 0 && (
              <div className="mt-3 space-y-1.5 border-t border-gray-50 pt-3">
                {t.interventions.map((i) => (
                  <div key={i.id} className="rounded-lg bg-gray-50 px-3 py-2">
                    <p className="text-xs font-medium text-gray-700 truncate">{i.designation || i.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">🔧 {i.vehicule.nom} · {i.vehicule.numero_de_plaque}</p>
                    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUT_INT_STYLE[i.statut] ?? 'bg-gray-100 text-gray-500'}`}>
                      {i.statut.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Interventions du jour ─────────────────────────────────────────────────────
function InterventionSection({ interventions }: { interventions: IInterventionMe[] }) {
  if (interventions.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
        Interventions aujourd&apos;hui · {interventions.length}
      </h2>
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-50 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400">Véhicule</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400">Technicien</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400">Description</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-400">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {interventions.map((i) => (
              <tr key={i.id} className="hover:bg-gray-50/60 transition">
                <td className="px-4 py-2.5">
                  <p className="font-medium text-gray-800">{i.vehicule.nom}</p>
                  <p className="text-xs text-gray-400 font-mono">{i.vehicule.numero_de_plaque}</p>
                </td>
                <td className="px-4 py-2.5 text-gray-600 text-sm">{i.technicien.prenom} {i.technicien.nom}</td>
                <td className="px-4 py-2.5 text-xs text-gray-500 max-w-xs truncate">{i.description}</td>
                <td className="px-4 py-2.5">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUT_INT_STYLE[i.statut] ?? 'bg-gray-100 text-gray-500'}`}>
                    {i.statut.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─── Page principale ───────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const [profileRes, statsRes, vehiculesRes, techniciensRes, interventionsRes] = await Promise.all([
    getProfile(),
    getSiteStats(),
    getMyVehicules(),
    getMyTechniciens(),
    getMyInterventions(),
  ]);

  if (!profileRes.success) redirect('/login');

  const responsable   = profileRes.data;
  const couleur       = responsable.site.couleur ?? '#10b981';
  const stats         = statsRes.success ? statsRes.data : null;
  const vehicules: IVehiculeMe[]         = vehiculesRes.success ? vehiculesRes.data : [];
  const techniciens: ITechnicienMe[]     = techniciensRes.success ? techniciensRes.data : [];
  const interventions: IInterventionMe[] = interventionsRes.success ? interventionsRes.data : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-10">
      {/* En-tête */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bonjour, {responsable.prenom} 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Tableau de bord ·{' '}
            <span className="font-semibold" style={{ color: couleur }}>Site {responsable.site.nom}</span>
            {responsable.site.region ? ` · ${responsable.site.region}` : ''}
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
      {stats && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">Vue d&apos;ensemble</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard label="Véhicules"      value={stats.totalVehicules}          couleur={couleur} />
            <StatCard label="Disponibles"    value={stats.vehiculesActifs}          couleur="#10b981" />
            <StatCard label="En maintenance" value={stats.vehiculesEnMaintenance}   couleur="#f59e0b" />
            <StatCard label="Techniciens"    value={stats.totalTechniciens}         couleur={couleur} />
            <StatCard label="Rapports"       value={stats.totalRapports}            couleur={couleur} />
          </div>
        </section>
      )}

      {/* Équipements */}
      {vehicules.length > 0 && <VehiculeSection vehicules={vehicules} couleur={couleur} />}

      {/* Techniciens */}
      {techniciens.length > 0 && <TechnicienSection techniciens={techniciens} couleur={couleur} />}

      {/* Interventions */}
      <InterventionSection interventions={interventions} />

      {/* Rapports récents */}
      {stats && stats.derniersRapports.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Derniers rapports</h2>
            <Link
              href="/rapports/nouveau"
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition"
              style={{ backgroundColor: couleur }}
            >
              + Nouveau rapport
            </Link>
          </div>
          <div className="space-y-2">
            {stats.derniersRapports.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {new Date(r.date).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {r.ops} opérationnel{r.ops > 1 ? 's' : ''} · {r.pannes} panne{r.pannes > 1 ? 's' : ''}
                  </p>
                </div>
                <span className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: couleur }}>
                  {r.total} véhicules
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}