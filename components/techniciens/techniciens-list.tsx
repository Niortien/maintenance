'use client'

import React, { useState, useEffect } from "react";
import TechniciensCards from "./techniciens-cards";
import { getAllTechniciens } from "@/service/techniciens/technicien.action";
import { toast } from "sonner";
import type { ITechnicien } from "@/service/techniciens/types/technicien.type";

const TechniciensList = () => {
  const [techniciens, setTechniciens] = useState<ITechnicien[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch des techniciens
  const fetchTechniciens = async () => {
  setLoading(true);
  try {
    const res = await getAllTechniciens(); // ici TS sait que res.data est ITechnicien[]

    if (res.success) {
      setTechniciens(res.data); // data est bien un tableau de techniciens
      toast.success("Techniciens chargés !");
    } else {
      toast.error(res.error);
    }
  } catch (error) {
    console.error(error);
    toast.error("Erreur lors du chargement des techniciens");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchTechniciens();
  }, []);

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
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      )}
      
      {!loading && techniciens.length === 0 && (
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
