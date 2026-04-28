'use client';

import { totalData, TotalItem } from "@/data/total.data";
import { getAllVehicule } from "@/service/vehicule/vehicule.action";
import { getAllTechniciens } from "@/service/techniciens/technicien.action";
import { getAllInterventions } from "@/service/interventions/interventions.action";
import { IVehicule } from "@/service/vehicule/types/vehicule.type";
import { ITechnicien } from "@/service/techniciens/types/technicien.type";
import { IIntervention } from "@/service/interventions/types/interventions/intervention.type";
import { motion } from "framer-motion";
import React, { useState } from "react";
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

interface CardTotalProps {
  item: TotalItem;
  index?: number;
  count?: number;
}

const CardTotal = ({ item, index = 0, count }: CardTotalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -4 }}
      className={`w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(33.333%-1rem)] h-52 m-2 flex flex-col justify-center gap-4 rounded-2xl ${item.color} p-6 text-white shadow-lg border border-white/10 backdrop-blur-sm hover:shadow-2xl hover:border-white/20 transition-all duration-300`}
    >
      <div className="flex flex-col items-center justify-center gap-3">
        <span className="text-5xl opacity-90">{item.icone}</span>
        <span className={`${item.chiffreColor} font-bold text-3xl`}>
          {count !== undefined ? count : item.chiffre || 0}
        </span>
      </div>
      <div className="text-white/90 items-center flex justify-center text-center text-sm font-medium leading-relaxed">
        {item.description}
      </div>
    </motion.div>
  );
};

const TotalCard = () => {
  const [vehicules, setVehicules] = useState<IVehicule[]>([]);
  const [techniciens, setTechniciens] = useState<ITechnicien[]>([]);
  const [interventions, setInterventions] = useState<IIntervention[]>([]);

  // Utiliser React Query pour les données
  const { data: vehiculesData, isPending: vehiculesPending, error: vehiculesError } = useQuery({
    queryKey: ['vehicules', 'total-card'],
    queryFn: () => getAllVehicule(),
  });

  const { data: techniciensData, isPending: techniciensPending, error: techniciensError } = useQuery({
    queryKey: ['techniciens', 'total-card'],
    queryFn: () => getAllTechniciens(),
  });

  const { data: interventionsData, isPending: interventionsPending, error: interventionsError } = useQuery({
    queryKey: ['interventions', 'total-card'],
    queryFn: () => getAllInterventions(),
  });

  // Mettre à jour l'état local quand les données changent
  React.useEffect(() => {
    if (vehiculesData?.success && vehiculesData.data) {
      setVehicules(vehiculesData.data);
    }
  }, [vehiculesData]);

  React.useEffect(() => {
    if (techniciensData?.success && techniciensData.data) {
      setTechniciens(techniciensData.data);
    }
  }, [techniciensData]);

  React.useEffect(() => {
    if (interventionsData?.success && interventionsData.data) {
      setInterventions(interventionsData.data);
    }
  }, [interventionsData]);

  // Gérer les erreurs
  React.useEffect(() => {
    if (vehiculesError) toast.error("Erreur lors du chargement des véhicules");
    if (techniciensError) toast.error("Erreur lors du chargement des techniciens");
    if (interventionsError) toast.error("Erreur lors du chargement des interventions");
    
    if (!vehiculesData?.success && vehiculesData?.error) {
      toast.error(vehiculesData.error);
    }
    if (!techniciensData?.success && techniciensData?.error) {
      toast.error(techniciensData.error);
    }
    if (!interventionsData?.success && interventionsData?.error) {
      toast.error(interventionsData.error);
    }
  }, [vehiculesError, techniciensError, interventionsError, vehiculesData, techniciensData, interventionsData]);

  const isLoading = vehiculesPending || techniciensPending || interventionsPending;

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Calcul des valeurs
  const totalVehicules = vehicules.length;
  const vehiculesEnMaintenance = vehicules.filter((v) => v.statut === "MAINTENANCE" || v.statut === "EN_MAINTENANCE").length;
  const totalTechniciens = techniciens.length;
  const techniciensActifs = techniciens.filter((t) => t.statut === "ACTIF" || t.statut === "ACTIVE").length;
  
  // Calcul du temps moyen par intervention
  const tempsMoyen = interventions.length > 0 
    ? Math.round(interventions.reduce((acc, i) => acc + (i.temps_estime_heures || 0), 0) / interventions.length)
    : 0;

  const getValueForTitle = (title: string) => {
    switch (title) {
      case "Vehicules totale":
        return totalVehicules;
      case "Techniciens":
        return totalTechniciens;
      case "Temps Moyen":
        return tempsMoyen;
      default:
        return undefined;
    }
  };

  const getDescriptionForTitle = (title: string) => {
    switch (title) {
      case "Vehicules totale":
        return `${vehiculesEnMaintenance} en maintenance`;
      case "Techniciens":
        return `${techniciensActifs} actifs`;
      case "Temps Moyen":
        return `par intervention`;
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-wrap md:justify-start sm:justify-between lg:justify-between">
      {totalData.map((item, index) => (
        <CardTotal 
          key={index} 
          item={{ 
            ...item, 
            description: getDescriptionForTitle(item.title) 
          }} 
          index={index}
          count={getValueForTitle(item.title)}
        />
      ))}
    </div>
  );
};

export default TotalCard;
