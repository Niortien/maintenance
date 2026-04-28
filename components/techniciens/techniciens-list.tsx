'use client'

import React, { useState } from "react";
import TechniciensCards from "./techniciens-cards";
import { getAllTechniciens } from "@/service/techniciens/technicien.action";
import toast from 'react-hot-toast';
import type { ITechnicien } from "@/service/techniciens/types/technicien.type";
import { useQuery } from '@tanstack/react-query';

const TechniciensList = () => {
  const [techniciens, setTechniciens] = useState<ITechnicien[]>([]);

  // Utiliser React Query pour les techniciens
  const { data: techniciensData, isPending, error } = useQuery({
    queryKey: ['techniciens', 'list'],
    queryFn: () => getAllTechniciens(),
  });

  // Mettre à jour l'état local quand les données changent
  React.useEffect(() => {
    if (techniciensData?.success && techniciensData.data) {
      setTechniciens(techniciensData.data);
    }
  }, [techniciensData]);

  // Gérer les erreurs
  React.useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement des techniciens");
    } else if (techniciensData && !techniciensData.success) {
      toast.error(typeof techniciensData.error === 'string' ? techniciensData.error : 'Erreur lors du chargement');
    }
  }, [error, techniciensData]);

  // Supprimer un technicien
  const handleDelete = (id: string) => {
    setTechniciens(prev => prev.filter(t => t.id !== id));
  };

  // Mettre à jour un technicien
  const handleUpdate = (updated: ITechnicien) => {
    setTechniciens(prev =>
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
      
      {!isPending && techniciens.length === 0 && (
        <div className="text-center py-12 rounded-2xl bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600">
          <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">Aucun technicien disponible</p>
          <p className="text-slate-500 dark:text-slate-500 mt-2">Commencez par ajouter votre premier technicien</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {techniciens.map((technicien) => (
          <div key={technicien.id}>
            <TechniciensCards
              technicien={technicien}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechniciensList;
