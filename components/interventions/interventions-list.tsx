'use client';

import React, { useState } from "react";
import { getAllInterventions } from "@/service/interventions/interventions.action";
import { IIntervention } from "@/service/interventions/types/interventions/intervention.type";
import { toast } from "sonner";
import InterventionCard from "./interventions-card";
import { useQuery } from '@tanstack/react-query';

const InterventionList = () => {
  const [interventions, setInterventions] = useState<IIntervention[]>([]);

  // Utiliser React Query pour les interventions
  const { data: interventionsData, isPending, error } = useQuery({
    queryKey: ['interventions', 'list'],
    queryFn: () => getAllInterventions(),
  });

  // Mettre à jour l'état local quand les données changent
  React.useEffect(() => {
    if (interventionsData?.success && interventionsData.data) {
      setInterventions(interventionsData.data);
    }
  }, [interventionsData]);

  // Gérer les erreurs
  React.useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement des interventions");
    } else if (!interventionsData?.success && interventionsData?.error) {
      toast.error(interventionsData.error);
    }
  }, [error, interventionsData]);

  const handleDelete = (id: string) => {
    setInterventions((prev) => prev.filter((i) => i.id !== id));
  };

  const handleUpdate = (updated: IIntervention) => {
    setInterventions((prev) =>
      prev.map((i) => (i.id === updated.id ? updated : i))
    );
  };

  if (isPending) return (
    <div className="flex items-center justify-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );

  if (!isPending && interventions.length === 0)
    return (
      <div className="text-center py-16 rounded-2xl bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600">
        <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">Aucune intervention disponible</p>
        <p className="text-slate-500 dark:text-slate-500 mt-2">Créez votre première intervention</p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {interventions.map((intervention) => (
        <InterventionCard
          key={intervention.id}
          intervention={intervention}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
};

export default InterventionList;
