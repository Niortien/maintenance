import { IAdminStatsCards } from '@/service/auth/types/auth.type';

function StatCard({
  label,
  value,
  sub,
  color = 'amber',
}: {
  label: string;
  value: number | string;
  sub?: string;
  color?: 'amber' | 'emerald' | 'red' | 'blue' | 'gray';
}) {
  const colorMap = {
    amber:   'text-amber-400',
    emerald: 'text-emerald-400',
    red:     'text-red-400',
    blue:    'text-blue-400',
    gray:    'text-gray-300',
  };
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${colorMap[color]}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-600">{sub}</p>}
    </div>
  );
}

export function AdminStatsCards({ stats }: { stats: IAdminStatsCards }) {
  const total = stats.vehiculesParStatut.operationnel
    + stats.vehiculesParStatut.enPanne
    + stats.vehiculesParStatut.accidente
    + stats.vehiculesParStatut.enAttente;

  return (
    <div className="space-y-6">
      {/* KPI principaux */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Sites" value={stats.totalSites} color="blue" />
        <StatCard label="Techniciens" value={stats.totalTechniciens} color="gray" />
        <StatCard label="Rapports" value={stats.totalRapports} color="amber" />
        <StatCard
          label="Taux opérationnel"
          value={`${stats.tauxOperationnel}%`}
          sub={`${stats.totalLignes} lignes analysées`}
          color={stats.tauxOperationnel >= 70 ? 'emerald' : stats.tauxOperationnel >= 40 ? 'amber' : 'red'}
        />
      </div>

      {/* Véhicules par statut */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
        <p className="mb-4 text-sm font-semibold text-white">Véhicules par statut</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Opérationnels', value: stats.vehiculesParStatut.operationnel, color: 'bg-emerald-500' },
            { label: 'En panne',      value: stats.vehiculesParStatut.enPanne,      color: 'bg-red-500' },
            { label: 'Accidentés',   value: stats.vehiculesParStatut.accidente,    color: 'bg-orange-500' },
            { label: 'En attente',   value: stats.vehiculesParStatut.enAttente,    color: 'bg-gray-500' },
          ].map((item) => (
            <div key={item.label} className="rounded-lg bg-gray-800 p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`h-2 w-2 rounded-full ${item.color}`} />
                <span className="text-xs text-gray-400">{item.label}</span>
              </div>
              <p className="text-xl font-bold text-white">{item.value}</p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-gray-700">
                <div
                  className={`h-1.5 rounded-full ${item.color}`}
                  style={{ width: total > 0 ? `${Math.round((item.value / total) * 100)}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top pannes */}
      {stats.topPannes.length > 0 && (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <p className="mb-4 text-sm font-semibold text-white">Top types de pannes</p>
          <div className="space-y-2.5">
            {stats.topPannes.map((p, i) => {
              const max = stats.topPannes[0].count;
              return (
                <div key={p.type} className="flex items-center gap-3">
                  <span className="w-4 text-xs text-gray-600 text-right">{i + 1}</span>
                  <span className="w-32 truncate text-xs text-gray-300">{p.type.replace(/_/g, ' ')}</span>
                  <div className="flex-1 h-2 rounded-full bg-gray-800">
                    <div
                      className="h-2 rounded-full bg-amber-500"
                      style={{ width: `${Math.round((p.count / max) * 100)}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-xs font-semibold text-amber-400">{p.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
