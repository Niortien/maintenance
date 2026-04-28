'use client'

import React, { useState } from "react";
import { IVehicule } from "@/service/vehicule/types/vehicule.type";
import { getAllVehicule } from "@/service/vehicule/vehicule.action";
import toast from 'react-hot-toast';
import VehiculeCards from "./vehicule-cards";
import { useQuery } from '@tanstack/react-query';
import EmptyState from "./empty-state";

const VehiculeList = () => {
  const [vehicules, setVehicules] = useState<IVehicule[]>([]);

  // Utiliser React Query pour les véhicules
  const { data: vehiculesData, isPending, error } = useQuery({
    queryKey: ['vehicules', 'list'],
    queryFn: () => getAllVehicule(),
  });

  // Mettre à jour l'état local quand les données changent
  React.useEffect(() => {
    if (vehiculesData?.success && vehiculesData.data) {
      setVehicules(vehiculesData.data);
    }
  }, [vehiculesData]);

  // Gérer les erreurs
  React.useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement des véhicules");
    } else if (vehiculesData?.success) {
      toast.success("Véhicules chargés !");
    } else if (vehiculesData?.error) {
      toast.error(vehiculesData.error);
    }
  }, [error, vehiculesData]);

  // Supprimer un véhicule
  const handleDelete = (id: string) => {
    setVehicules(prev => prev.filter(t => t.id !== id));
  };

  // Mettre à jour un véhicule
  const handleUpdate = (updated: IVehicule) => {
    setVehicules(prev =>
      prev.map(t => (t.id === updated.id ? updated : t))
    );
  };

  return (
    <div className="space-y-6">
      {isPending && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      )}
      
      {!isPending && vehicules.length === 0 && (
        <div className="text-center py-12 rounded-2xl bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600">
          <EmptyState text="véhicule"/>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicules.map((vehicule) => (
          <div key={vehicule.id}>
            <VehiculeCards
              vehicule={vehicule}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehiculeList;
