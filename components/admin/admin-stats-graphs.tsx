'use client';

import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import { IAdminStatsGraph } from '@/service/auth/types/auth.type';

// Palette de secours si siteCouleur est null
const FALLBACK_COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'];

export function AdminStatsGraphs({ graph }: { graph: IAdminStatsGraph }) {
  // ─── Série temporelle : regrouper par date ───────────────────────────────
  const dateMap = new Map<string, Record<string, number | string>>();
  for (const s of graph.series) {
    if (!dateMap.has(s.date)) dateMap.set(s.date, { date: s.date });
    const row = dateMap.get(s.date)!;
    row[`${s.siteNom}_op`]    = s.operationnel;
    row[`${s.siteNom}_panne`] = s.enPanne;
  }
  const timeData = Array.from(dateMap.values()).sort((a, b) =>
    String(a.date).localeCompare(String(b.date)),
  );

  // Sites uniques pour les lignes
  const siteNames = [...new Set(graph.series.map((s) => s.siteNom))];
  const siteColorMap = Object.fromEntries(
    graph.series.map((s) => [s.siteNom, s.siteCouleur]),
  );

  // ─── bySite : données barres ─────────────────────────────────────────────
  const barData = graph.bySite.map((s, i) => ({
    nom:           s.siteNom,
    Opérationnels: s.operationnel,
    'En panne':    s.enPanne,
    Accidentés:   s.accidente,
    'En attente':  s.enAttente,
    fill:          s.siteCouleur ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
  }));

  if (graph.series.length === 0 && graph.bySite.length === 0) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-8 text-center text-sm text-gray-500">
        Aucune donnée graphique disponible pour cette période.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Courbes d'évolution */}
      {timeData.length > 1 && (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <p className="mb-4 text-sm font-semibold text-white">Évolution dans le temps — opérationnels par site</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={timeData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickFormatter={(v: string) =>
                  new Date(v).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
                }
              />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
                labelFormatter={(v: string) => new Date(v).toLocaleDateString('fr-FR')}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
              {siteNames.map((nom, i) => (
                <Line
                  key={nom}
                  type="monotone"
                  dataKey={`${nom}_op`}
                  name={nom}
                  stroke={siteColorMap[nom] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Barres par site */}
      {barData.length > 0 && (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <p className="mb-4 text-sm font-semibold text-white">Comparaison par site — statut des véhicules</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="nom" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
              <Bar dataKey="Opérationnels" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="En panne"      stackId="a" fill="#ef4444" />
              <Bar dataKey="Accidentés"   stackId="a" fill="#f97316" />
              <Bar dataKey="En attente"   stackId="a" fill="#6b7280" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
