'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ISituation, StatutSituation } from '@/service/situation/types/situation.type';
import { adminGetSituations } from '@/service/situation/situation.action';
import AdminSituationCard from '@/components/admin/admin-situation-card';

const STATUTS: { value: StatutSituation | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Toutes' },
  { value: 'EN_ATTENTE', label: 'En attente' },
  { value: 'EN_COURS', label: 'En cours' },
  { value: 'VALIDEE', label: 'Validées' },
  { value: 'TERMINEE', label: 'Terminées' },
];

const AdminSituationsIndex = () => {
  const [situations, setSituations] = useState<ISituation[]>([]);
  const [filter, setFilter] = useState<StatutSituation | 'ALL'>('ALL');

  const { isPending, data, error } = useQuery({
    queryKey: ['admin-situations'],
    queryFn: adminGetSituations,
    refetchInterval: 30_000,
  });

  React.useEffect(() => {
    if (data?.success) setSituations(data.data);
    else if (data && !data.success) toast.error(data.error);
  }, [data]);

  React.useEffect(() => {
    if (error) toast.error('Erreur lors du chargement des situations');
  }, [error]);

  const handleUpdate = (updated: ISituation) =>
    setSituations((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));

  const filtered = filter === 'ALL' ? situations : situations.filter((s) => s.statut === filter);

  const counts = STATUTS.map((s) => ({
    ...s,
    count: s.value === 'ALL' ? situations.length : situations.filter((sit) => sit.statut === s.value).length,
  }));

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {counts.map((s) => (
          <button
            key={s.value}
            onClick={() => setFilter(s.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${
              filter === s.value
                ? 'bg-amber-500 text-gray-900 border-amber-500'
                : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500'
            }`}
          >
            {s.label}
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${filter === s.value ? 'bg-gray-900/30' : 'bg-gray-700'}`}>
              {s.count}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-dashed border-gray-700">
          <p className="text-4xl mb-3">⚠️</p>
          <p className="text-gray-400 font-medium">Aucune situation trouvée</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((s) => (
            <AdminSituationCard key={s.id} situation={s} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSituationsIndex;
