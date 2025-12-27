'use client'

import { IVehicule } from "@/service/vehicule/types/vehicule.type";
import { getAllVehicule } from "@/service/vehicule/vehicule.action";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import VehiculeCards from "./vehicule-cards";

import EmptyState from "./empty-state";

const VehiculeList = () => {
  const [vehicules, setVehicules] = useState<IVehicule[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch des vehicules
  const fetchVehicule = async () => {
  setLoading(true);
  try {
    const res = await getAllVehicule(); // ici TS sait que res.data est ITechnicien[]

    if (res.success) {
      setVehicules(res.data); // data est bien un tableau de techniciens
      toast.success("Vehicule chargés !");
    } else {
      toast.error(res.error);
    }
  } catch (error) {
    console.error(error);
    toast.error("Erreur lors du chargement des vehicules");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchVehicule();
  }, []);

  // Supprimer un vehicule
  const handleDelete = (id: string) => {
    setVehicules(prev => prev.filter(t => t.id !== id));
  };

  // Mettre à jour un vehicule
  const handleUpdate = (updated: IVehicule) => {
    setVehicules(prev =>
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
      
      {!loading && vehicules.length === 0 && (
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
