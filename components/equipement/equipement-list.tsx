'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { IEquipement } from '@/service/equipement/types/equipement.type';
import { getMyEquipements } from '@/service/equipement/equipement.action';
import { CATEGORIE_LABELS } from '@/service/equipement/equipement.schema';
import EquipementCard from './equipement-card';

const EquipementList = () => {
  const [equipements, setEquipements] = useState<IEquipement[]>([]);
  const [filtre, setFiltre] = useState<string>('TOUS');

  const { isPending, error, data } = useQuery({
    queryKey: ['equipements'],
    queryFn: () => getMyEquipements(),
  });

  React.useEffect(() => {
    if (data?.success) setEquipements(data.data);
    else if (data && !data.success) toast.error(data.error);
  }, [data]);

  React.useEffect(() => {
    if (error) toast.error('Erreur lors du chargement des équipements');
  }, [error]);

  const handleDelete = (id: string) => setEquipements((prev) => prev.filter((e) => e.id !== id));
  const handleUpdate = (updated: IEquipement) =>
    setEquipements((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));

  const categories = ['TOUS', ...Array.from(new Set(equipements.map((e) => e.categorie)))];
  const filtered = filtre === 'TOUS' ? equipements : equipements.filter((e) => e.categorie === filtre);

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres par catégorie */}
      {equipements.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltre(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                filtre === cat
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-700'
              }`}
            >
              {cat === 'TOUS' ? 'Tous' : CATEGORIE_LABELS[cat] ?? cat}
              {cat !== 'TOUS' && (
                <span className="ml-1 opacity-70">
                  ({equipements.filter((e) => e.categorie === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Grille */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white border-2 border-dashed border-slate-200">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-slate-500 font-medium">Aucun équipement{filtre !== 'TOUS' ? ` dans cette catégorie` : ''}</p>
          <p className="text-slate-400 text-sm mt-1">Ajoutez un équipement pour commencer</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((eq) => (
            <EquipementCard
              key={eq.id}
              equipement={eq}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EquipementList;
