'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ISituation } from '@/service/situation/types/situation.type';
import { getMySituations } from '@/service/situation/situation.action';
import { getMyEquipements } from '@/service/equipement/equipement.action';
import { IEquipement } from '@/service/equipement/types/equipement.type';
import AjouterSituationDialog from './ajouter-situation';
import SituationCard from './situation-card';

const SituationIndex = () => {
  const [situations, setSituations] = useState<ISituation[]>([]);
  const [equipements, setEquipements] = useState<IEquipement[]>([]);

  const { isPending, error, data } = useQuery({
    queryKey: ['situations'],
    queryFn: () => getMySituations(),
  });

  const { data: equipData } = useQuery({
    queryKey: ['equipements'],
    queryFn: () => getMyEquipements(),
  });

  React.useEffect(() => {
    if (data?.success) setSituations(data.data);
    else if (data && !data.success) toast.error(data.error);
  }, [data]);

  React.useEffect(() => {
    if (equipData?.success) setEquipements(equipData.data);
  }, [equipData]);

  React.useEffect(() => {
    if (error) toast.error('Erreur lors du chargement des situations');
  }, [error]);

  const handleDelete = (id: string) => setSituations((prev) => prev.filter((s) => s.id !== id));
  const handleUpdate = (updated: ISituation) =>
    setSituations((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AjouterSituationDialog equipements={equipements} />

      {situations.length === 0 ? (
        <div className="text-center py-20 rounded-2xl bg-white border-2 border-dashed border-slate-200">
          <p className="text-5xl mb-3">⚠️</p>
          <p className="text-slate-500 font-medium text-lg">Aucune situation enregistrée</p>
          <p className="text-slate-400 text-sm mt-1">Créez une nouvelle situation pour commencer</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {situations.map((s) => (
            <SituationCard
              key={s.id}
              situation={s}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SituationIndex;
