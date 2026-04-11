'use client'

import { bilanData, BilanItem } from "@/data/bilan.data";
import { getAllInterventions, getInterventionStats } from "@/service/interventions/interventions.action";
import { getAllTechniciens } from "@/service/techniciens/technicien.action";
import { getAllVehicule } from "@/service/vehicule/vehicule.action";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { IIntervention } from "@/service/interventions/types/interventions/intervention.type";
import { ITechnicien } from "@/service/techniciens/types/technicien.type";
import { IVehicule } from "@/service/vehicule/types/vehicule.type";
import { motion } from "framer-motion";
import { useQuery } from '@tanstack/react-query'


interface CardBilanProps {
  item: BilanItem;
  value?: number;
  index?: number;
}

const CardBilan = ({ item, value, index = 0 }: CardBilanProps) => {
  const isWhiteBg = item.color?.includes("bg-white");
  
  // Utiliser les données passées en props plutôt que de faire un appel API
  // Les statistiques sont calculées dans le composant parent BilanCard
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className={`w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1rem)] h-36 m-2 flex justify-between items-center p-6 rounded-2xl  ${item.color} ${isWhiteBg ? 'text-emerald-600' : 'text-white'} shadow-lg border border-white/10 backdrop-blur-sm hover:shadow-2xl transition-all duration-300`}
    >
      <div className="flex flex-col justify-between items-start gap-2 flex-1">
        <span className={`${isWhiteBg ? 'text-emerald-600/80' : 'text-white/80'} font-medium text-sm uppercase tracking-wide`}>{item.title}</span>
        <span className={`${item.chiffreColor} font-bold text-4xl`}>
          {value !== undefined ? value : item.chiffre}
        </span>
      </div>
      <div className="flex items-center justify-center ml-4 text-5xl opacity-80">{item.icone}</div>
    </motion.div>
  );
};

const BilanCard = () => {
  const [techniciens, setTechniciens] = useState<ITechnicien[]>([]);
  const [vehicules, setVehicules] = useState<IVehicule[]>([]);

  // Utiliser useQuery pour les statistiques d'interventions
  const { data: statsData, isPending: statsPending, error: statsError } = useQuery({
    queryKey: ['interventionsstats'],
    queryFn: () => getInterventionStats(),
  });

  const fetchData = async () => {
    try {
      const resTechniciens = await getAllTechniciens();
      if (resTechniciens.success && "data" in resTechniciens) {
        setTechniciens(resTechniciens.data);
      } else {
        toast.error(resTechniciens.error || "Erreur lors du chargement des techniciens");
      }

      const resVehicules = await getAllVehicule();
      if (resVehicules.success && "data" in resVehicules) {
        setVehicules(resVehicules.data);
      } else {
        toast.error(resVehicules.error || "Erreur lors du chargement des véhicules");
      }
    } catch {
      toast.error("Erreur inattendue");
    }
  };

  useEffect(() => {
    fetchData();
    // Rafraîchir chaque 30 secondes
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Utiliser les données de l'API si disponibles, sinon fallback sur 0
  const stats = statsData?.success ? statsData.data : null;
  const totalInterventions = stats?.totalInterventions ?? 0;
  const enCours = stats?.interventionsEnCours ?? 0;
  const terminees = stats?.interventionsTerminees ?? 0;
  const urgentes = stats?.interventionsUrgentes ?? 0;
  const totalTechniciens = techniciens.length;
  const totalVehicules = vehicules.length;

  const getValueForTitle = (title: string) => {
    switch (title) {
      case "Total Interventions":
        return totalInterventions;
      case "En Cours":
        return enCours;
      case "Terminées":
        return terminees;
      case "Urgentes":
        return urgentes;
      case "Total Techniciens":
        return totalTechniciens;
      case "Total Vehicules":
        return totalVehicules;
      default:
        return undefined;
    }
  };

  if (statsPending) {
    return <div className="flex justify-center p-8">Chargement des statistiques...</div>;
  }

  if (statsError) {
    return <div className="flex justify-center p-8 text-red-500">Erreur de chargement des statistiques</div>;
  }

  return (
    <div className="flex flex-wrap md:justify-start sm:justify-between lg:justify-between">
      {bilanData.map((item, index) => (
        <CardBilan key={index} item={item} value={getValueForTitle(item.title)} index={index} />
      ))}
    </div>
  );
};

export default BilanCard;
